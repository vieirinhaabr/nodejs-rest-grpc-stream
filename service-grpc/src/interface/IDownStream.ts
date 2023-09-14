import { IUseCase } from "@core/UseCase";
import { Stream } from "stream";

export type IDownStreamResponse = Stream;

export type IDownStreamUseCase = IUseCase<void, IDownStreamResponse>;
