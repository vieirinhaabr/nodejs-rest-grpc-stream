import { IAction } from "@core/Action";
import { IUseCase } from "@core/UseCase";
import { Request } from "express";
import { ReadStream } from "fs";

export interface IUpStreamParams {
  req: Request & ReadStream;
}

export type IUpStreamUseCase = IUseCase<IUpStreamParams, Promise<void>>;
export type IUpStreamGrpcAction = IAction<IUpStreamParams, Promise<void>>;
