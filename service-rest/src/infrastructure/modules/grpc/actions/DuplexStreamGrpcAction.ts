import { inject, injectable } from "inversify";
import { IDuplexStreamGrpcAction, IDuplexStreamParams, IDuplexStreamResponse } from "@interface/IDuplexStream";
import TYPES from "@core/Types";
import { Transform, TransformCallback } from "stream";
import busboy from "busboy";
import { ReadStream } from "fs";

import { IStreamServiceClient, DownstreamMessage } from "../../../../../../proto/dist";
import { StreamGrpcPresenter } from "../presenters/StreamGrpcPresenter";
import { StreamGrpcController } from "../controllers/StreamGrpcController";
import { IStreamHeaders } from "../interfaces/IStreamHeaders";

@injectable()
export default class DuplexStreamGrpcAction implements IDuplexStreamGrpcAction {
  constructor(
    @inject(TYPES.StreamGrpcClient)
    private service: IStreamServiceClient,
  ) {}

  async call(params: IDuplexStreamParams): Promise<IDuplexStreamResponse> {
    const { req } = params;
    const call = this.service.duplex();
    const bb = busboy({ headers: req.headers });

    await new Promise(function (resolve, reject) {
      let filename: string = null;
      const transform = new Transform({
        transform: (chunk: Uint8Array, _e: BufferEncoding, callback: TransformCallback) => {
          call.write(
            StreamGrpcController.toUpstreamMessage({
              data: Buffer.from(chunk).toString("base64"),
              filename,
            }),
            callback,
          );
        },
      });

      bb.on("file", function (_f: string, file: ReadStream, headers: IStreamHeaders) {
        filename = headers.filename;
        file
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

      req.pipe(bb);
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
