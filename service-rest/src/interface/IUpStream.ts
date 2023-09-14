import { IAction } from "@core/Action";
import { IUseCase } from "@core/UseCase";
import { ReadStream } from "fs";

export interface IUpStreamParams {
  stream: ReadStream;
}

export type IUpStreamUseCase = IUseCase<IUpStreamParams, Promise<void>>;
export type IUpStreamGrpcAction = IAction<IUpStreamParams, Promise<void>>;
