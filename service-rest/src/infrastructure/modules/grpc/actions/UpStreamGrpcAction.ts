import { inject, injectable } from "inversify";
import { IUpStreamGrpcAction, IUpStreamParams } from "@interface/IUpStream";
import TYPES from "@core/Types";
import { ServiceError } from "@grpc/grpc-js";
import { Transform, TransformCallback } from "stream";
import { ReadStream } from "fs";
import busboy from "busboy";

import { StreamGrpcController } from "../controllers/StreamGrpcController";
import { IStreamServiceClient } from "../../../../../../proto/dist";
import { IStreamHeaders } from "../interfaces/IStreamHeaders";

@injectable()
export default class UpStreamGrpcAction implements IUpStreamGrpcAction {
  constructor(
    @inject(TYPES.StreamGrpcClient)
    private service: IStreamServiceClient,
  ) {}

  async call(params: IUpStreamParams): Promise<void> {
    const { req } = params;
    const service = this.service;
    const bb = busboy({ headers: req.headers });

    return new Promise(function (resolve, reject) {
      const call = service.upload(function (error: ServiceError) {
        if (error) {
          req.destroy();
          reject(error);
        } else {
          resolve();
        }
      });

      let filename: string = null;
      const transform = new Transform({
        transform: (chunk: Uint8Array, _e: BufferEncoding, callback: TransformCallback) => {
          const request = StreamGrpcController.toUpstreamMessage({
            data: Buffer.from(chunk).toString("base64"),
            filename,
          });
          call.write(request, callback);
        },
      });

      bb.on("file", function (_f: string, file: ReadStream, headers: IStreamHeaders) {
        filename = headers.filename;
        file
          .pipe(transform)
          .on("error", (err: Error) => {
            call.destroy(err);
          })
          .on("finish", () => {
            call.end();
          });
      });

      req.pipe(bb);
    });
  }
}
