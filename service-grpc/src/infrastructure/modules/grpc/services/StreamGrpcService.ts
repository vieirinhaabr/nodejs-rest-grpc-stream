import TYPES from "@core/Types";
import { inject, injectable } from "inversify";
import {
  ServerReadableStream,
  ServerWritableStream,
  UntypedHandleCall,
  sendUnaryData,
  ServerDuplexStream,
} from "@grpc/grpc-js";
import { IUpStreamUseCase } from "@interface/IUpStream";
import { IDownStreamUseCase } from "@interface/IDownStream";
import { IDuplexStreamUseCase } from "@interface/IDuplexStream";

import { StreamGrpcController } from "../controller/StreamGrpcController";
import { StreamGrpcPresenter } from "../presenter/StreamGrpcPresenter";
import { GrpcPresenter } from "../presenter/GrpcPresenter";
import { IStreamServiceServer, UpstreamMessage, DownstreamMessage, EmptyMessage } from "../../../../../../proto/dist";
import { StreamGrpcAdapter } from "../adapter/StreamGrpcAdapter";

@injectable()
export default class StreamGrpcService extends StreamGrpcAdapter implements IStreamServiceServer {
  [name: string]: UntypedHandleCall | any;

  constructor(
    @inject(TYPES.UpStreamUseCase) private upStreamUseCase: IUpStreamUseCase,
    @inject(TYPES.DownStreamUseCase) private downStreamUseCase: IDownStreamUseCase,
    @inject(TYPES.DuplexStreamUseCase) private duplexStreamUseCase: IDuplexStreamUseCase,
  ) {
    super();
  }

  async upload(
    call: ServerReadableStream<UpstreamMessage, EmptyMessage>,
    cb: sendUnaryData<EmptyMessage>,
  ): Promise<void> {
    await this.upStreamUseCase.execute({
      stream: call,
      onData: function (chunk: UpstreamMessage) {
        return StreamGrpcController.fromUpstreamMessage(chunk);
      },
    });

    const response = GrpcPresenter.toEmpty();

    cb(null, response);
  }

  async download(call: ServerWritableStream<EmptyMessage, DownstreamMessage>): Promise<void> {
    const stream = this.downStreamUseCase.execute();

    await this.sendByStream(
      call,
      function (chunk: Uint8Array) {
        const data = Buffer.from(chunk).toString("base64");
        //const data = Buffer.from(chunk).toString("utf-8"); // FIX
        return StreamGrpcPresenter.toDownstreamMessage({ data });
      },
      stream,
    );
  }

  async duplex(call: ServerDuplexStream<UpstreamMessage, DownstreamMessage>): Promise<void> {
    const stream = await this.duplexStreamUseCase.execute({
      stream: call,
      onData: function (chunk: UpstreamMessage) {
        return StreamGrpcController.fromUpstreamMessage(chunk);
      },
    });

    await this.sendByStream(
      call,
      function (chunk: Uint8Array) {
        const data = Buffer.from(chunk).toString("base64");
        return StreamGrpcPresenter.toDownstreamMessage({ data });
      },
      stream,
    );
  }
}
