import { IAction } from "@core/Action";
import { IUseCase } from "@core/UseCase";
import { Stream } from "stream";
import { ReadStream } from "fs";

export interface IDuplexStreamParams {
  stream: ReadStream;
}

export type IDuplexStreamResponse = Stream;

export type IDuplexStreamUseCase = IUseCase<IDuplexStreamParams, Promise<IDuplexStreamResponse>>;
export type IDuplexStreamGrpcAction = IAction<IDuplexStreamParams, Promise<IDuplexStreamResponse>>;
