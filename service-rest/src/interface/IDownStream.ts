import { IAction } from "@core/Action";
import { IUseCase } from "@core/UseCase";
import { Stream } from "stream";

export type IDownStreamResponse = Stream;

export type IDownStreamUseCase = IUseCase<void, Promise<IDownStreamResponse>>;
export type IDownStreamGrpcAction = IAction<void, Promise<IDownStreamResponse>>;
