import { IReceiveStream } from "@core/Stream";
import { IUseCase } from "@core/UseCase";
import { Stream } from "stream";

export interface IDuplexStreamChunk {
  data: string;
  filename?: string;
}

export type IDuplexStreamParams = IReceiveStream<IDuplexStreamChunk>;

export type IDuplexStreamResponse = Stream;

export type IDuplexStreamUseCase = IUseCase<IDuplexStreamParams, Promise<IDuplexStreamResponse>>;
