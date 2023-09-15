import TYPES from "@core/Types";
import { inject, injectable } from "inversify";
import { colors, ILogger } from "@core/Logger";
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
    @inject(TYPES.Logger) private logger: ILogger,
    @inject(TYPES.UpStreamUseCase) private upStreamUseCase: IUpStreamUseCase,
    @inject(TYPES.DownStreamUseCase) private downStreamUseCase: IDownStreamUseCase,
    @inject(TYPES.DuplexStreamUseCase) private duplexStreamUseCase: IDuplexStreamUseCase,
  ) {
    super();
  }

  private baseLogger = (fun: string) => `📨  [GrpcModule] [Server] => ${colors.info(`StreamGrpcService.${fun}`)} `;

  async upload(
    call: ServerReadableStream<UpstreamMessage, EmptyMessage>,
    cb: sendUnaryData<EmptyMessage>,
  ): Promise<void> {
    try {
      this.logger.info(`${this.baseLogger("upload")} ${colors.gray("receive call")}`);

      this.logger.info(`${this.baseLogger("upload")} ${colors.gray("use case")}`);
      await this.upStreamUseCase.execute({
        stream: call,
        onData: function (chunk: UpstreamMessage) {
          return StreamGrpcController.fromUpstreamMessage(chunk);
        },
      });

      const response = GrpcPresenter.toEmpty();

      this.logger.info(`${this.baseLogger("upload")} ${colors.gray("finished")}`);
      cb(null, response);
    } catch (error) {
      this.logger.error(`${this.baseLogger("upload")} ${colors.gray("error")}`);
      this.logger.error(String(error));
      cb(GrpcPresenter.toError(error), null);
    }
  }

  async download(cb: ServerWritableStream<EmptyMessage, DownstreamMessage>): Promise<void> {
    try {
      this.logger.info(`${this.baseLogger("download")} ${colors.gray("receive call")}`);

      this.logger.info(`${this.baseLogger("download")} ${colors.gray("use case")}`);
      const stream = this.downStreamUseCase.execute();

      await this.sendByStream(
        cb,
        function (chunk: Uint8Array) {
          const data = Buffer.from(chunk).toString("base64");
          return StreamGrpcPresenter.toDownstreamMessage({ data });
        },
        stream,
      );

      this.logger.info(`${this.baseLogger("download")} ${colors.gray("finished")}`);
    } catch (error) {
      this.logger.error(`${this.baseLogger("download")} ${colors.gray("error")}`);
      this.logger.error(String(error));
      cb.destroy(GrpcPresenter.toError(error));
    }
  }

  async duplex(call: ServerDuplexStream<UpstreamMessage, DownstreamMessage>): Promise<void> {
    try {
      this.logger.info(`${this.baseLogger("duplex")} ${colors.gray("receive call")}`);

      this.logger.info(`${this.baseLogger("duplex")} ${colors.gray("use case")}`);
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

      this.logger.info(`${this.baseLogger("duplex")} ${colors.gray("finished")}`);
    } catch (error) {
      this.logger.error(`${this.baseLogger("duplex")} ${colors.gray("error")}`);
      this.logger.error(String(error));
      call.destroy(GrpcPresenter.toError(error));
    }
  }
}
