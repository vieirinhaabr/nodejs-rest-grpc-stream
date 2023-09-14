import { IReceiveStream } from "@core/Stream";
import { IUseCase } from "@core/UseCase";

export type IUpStreamParams = IReceiveStream<IUpStreamChunk>;

export interface IUpStreamChunk {
  data: string;
  filename?: string;
}

export type IUpStreamUseCase = IUseCase<IUpStreamParams, Promise<void>>;
