import { inject, injectable } from "inversify";
import { IUpStreamGrpcAction, IUpStreamParams } from "@interface/IUpStream";
import TYPES from "@core/Types";
import { ServiceError } from "@grpc/grpc-js";
import { Transform, TransformCallback } from "stream";

import { StreamController } from "../controllers/StreamController";
import { IStreamServiceClient } from "../../../../../../proto/dist";

@injectable()
export default class UpStreamGrpcAction implements IUpStreamGrpcAction {
  constructor(
    @inject(TYPES.StreamGrpcClient)
    private service: IStreamServiceClient,
  ) {}

  async call(params: IUpStreamParams): Promise<void> {
    const { stream, filename } = params;
    const start = this.service.upload;

    return new Promise(function (resolve, reject) {
      const call = start(function (error: ServiceError) {
        if (error) {
          stream.destroy();
          reject(error);
        } else {
          resolve();
        }
      });

      const transform = new Transform({
        transform: (chunk: Uint8Array, _e: BufferEncoding, callback: TransformCallback) => {
          const request = StreamController.toUpstreamMessage({
            data: Buffer.from(chunk).toString("base64"),
            filename,
          });
          call.write(request, callback);
        },
      });

      stream
        .pipe(transform)
        .on("error", (err: Error) => {
          call.destroy(err);
        })
        .on("finish", () => {
          call.end();
        });
    });
  }
}
