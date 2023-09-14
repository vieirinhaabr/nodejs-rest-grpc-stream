import { inject, injectable } from "inversify";
import { IDuplexStreamGrpcAction, IDuplexStreamParams, IDuplexStreamResponse } from "@interface/IDuplexStream";
import TYPES from "@core/Types";
import { Transform, TransformCallback } from "stream";

import { UpstreamMessage, IStreamServiceClient, DownstreamMessage } from "../../../../../../proto/dist";
import { StreamPresenter } from "../presenters/StreamPresenter";
import { StreamController } from "../controllers/StreamController";

@injectable()
export default class DuplexStreamGrpcAction implements IDuplexStreamGrpcAction {
  constructor(
    @inject(TYPES.StreamGrpcClient)
    private service: IStreamServiceClient,
  ) {}

  async call(params: IDuplexStreamParams): Promise<IDuplexStreamResponse> {
    const { stream, filename } = params;
    const call = this.service.duplex();

    await new Promise(function (resolve, reject) {
      const transform = new Transform({
        transform: (chunk: Uint8Array, _e: BufferEncoding, callback: TransformCallback) => {
          const request = StreamController.toUpstreamMessage({ data: Buffer.from(chunk).toString("base64"), filename });
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
          call.write(StreamController.toUpstreamMessage({ data: "upload.stream.had.ended" }));
          resolve(null);
        });
    });

    const transform = new Transform({
      objectMode: true,
      transform(chunk: DownstreamMessage, _e: BufferEncoding, callback: TransformCallback) {
        const data = String(typeof chunk === "object" ? StreamPresenter.fromDownstreamMessage(chunk) : chunk);
        callback(null, data);
      },
    });

    call.on("error", (err: Error) => call.emit("data", `STREAM_ERROR => ${err}`));
    return call.pipe(transform);
  }
}
