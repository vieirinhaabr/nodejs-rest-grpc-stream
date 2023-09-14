import { inject, injectable } from "inversify";
import { IUpStreamGrpcAction, IUpStreamParams } from "@interface/IUpStream";
import TYPES from "@core/Types";
import { ServiceError } from "@grpc/grpc-js";
import { Transform, TransformCallback } from "stream";
import { isEmpty } from "lodash";

import { StreamGrpcController } from "../controllers/StreamGrpcController";
import { IStreamServiceClient } from "../../../../../../proto/dist";
import { IStreamHeaders } from "../interfaces/IStreamHeaders";
import { getStreamHeaders, ignoreChunk } from "../utils/streamHeader";

@injectable()
export default class UpStreamGrpcAction implements IUpStreamGrpcAction {
  constructor(
    @inject(TYPES.StreamGrpcClient)
    private service: IStreamServiceClient,
  ) {}

  async call(params: IUpStreamParams): Promise<void> {
    const { stream } = params;
    const service = this.service;

    return new Promise(function (resolve, reject) {
      const call = service.upload(function (error: ServiceError) {
        if (error) {
          stream.destroy();
          reject(error);
        } else {
          resolve();
        }
      });

      let headers: IStreamHeaders = null;
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
        })
        .on("finish", () => {
          call.end();
        });
    });
  }
}
