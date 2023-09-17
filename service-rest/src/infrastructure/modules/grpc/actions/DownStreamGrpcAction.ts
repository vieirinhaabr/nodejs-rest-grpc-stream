import { inject, injectable } from "inversify";
import TYPES from "@core/Types";
import { IDownStreamGrpcAction, IDownStreamResponse } from "@interface/IDownStream";
import { Transform, TransformCallback } from "stream";

import { GrpcController } from "../controllers/GrpcController";
import { StreamGrpcPresenter } from "../presenters/StreamGrpcPresenter";
import { DownstreamMessage, IStreamServiceClient } from "../../../../../../proto/dist";

@injectable()
export default class DownStreamGrpcAction implements IDownStreamGrpcAction {
  constructor(
    @inject(TYPES.StreamGrpcClient)
    private service: IStreamServiceClient,
  ) {}

  async call(): Promise<IDownStreamResponse> {
    const request = GrpcController.toEmptyRequest();
    const call = this.service.download(request);

    const transform = new Transform({
      objectMode: true,
      transform(chunk: DownstreamMessage, _e: BufferEncoding, callback: TransformCallback) {
        const data = String(typeof chunk === "object" ? StreamGrpcPresenter.fromDownstreamMessage(chunk) : chunk);
        callback(null, data);
      },
      highWaterMark: 64 * 1024,
    });

    call.on("error", (err: Error) => call.emit("data", `STREAM_ERROR => ${err}`));
    return call.pipe(transform);
  }
}
