import { inject, injectable } from "inversify";
import { IDuplexStreamGrpcAction, IDuplexStreamParams, IDuplexStreamResponse } from "@interface/IDuplexStream";
import TYPES from "@core/Types";
import { Transform, TransformCallback } from "stream";
import { isEmpty } from "lodash";

import { IStreamServiceClient, DownstreamMessage } from "../../../../../../proto/dist";
import { StreamGrpcPresenter } from "../presenters/StreamGrpcPresenter";
import { StreamGrpcController } from "../controllers/StreamGrpcController";
import { IStreamHeaders } from "../interfaces/IStreamHeaders";
import { getStreamHeaders, ignoreChunk } from "../utils/streamHeader";

@injectable()
export default class DuplexStreamGrpcAction implements IDuplexStreamGrpcAction {
  constructor(
    @inject(TYPES.StreamGrpcClient)
    private service: IStreamServiceClient,
  ) {}

  async call(params: IDuplexStreamParams): Promise<IDuplexStreamResponse> {
    const { stream } = params;
    const call = this.service.duplex();

    let headers: IStreamHeaders = null;
    await new Promise(function (resolve, reject) {
      const transform = new Transform({
        transform: (chunk: Uint8Array, _e: BufferEncoding, callback: TransformCallback) => {
          if (isEmpty(headers)) {
            headers = getStreamHeaders(chunk);
            return callback();
          } else if (ignoreChunk(headers, chunk)) {
            return callback();
          }

          const request = StreamGrpcController.toUpstreamMessage({
            data: Buffer.from(chunk).toString("base64"),
            filename: headers?.filename,
          });
          call.write(request, callback);
        },
      });

      stream
        .pipe(transform)
        .on("error", (err: Error) => {
          call.destroy(err);
          reject(err);
        })
        .on("finish", () => {
          call.write(StreamGrpcController.toUpstreamMessage({ data: "upload.stream.had.ended" }));
          resolve(null);
        });
    });

    const transform = new Transform({
      objectMode: true,
      transform(chunk: DownstreamMessage, _e: BufferEncoding, callback: TransformCallback) {
        const data = String(typeof chunk === "object" ? StreamGrpcPresenter.fromDownstreamMessage(chunk) : chunk);
        callback(null, data);
      },
    });

    call.on("error", (err: Error) => call.emit("data", `STREAM_ERROR => ${err}`));
    return call.pipe(transform);
  }
}
