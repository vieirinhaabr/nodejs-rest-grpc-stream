import { ServerDuplexStream, ServerWritableStream } from "@grpc/grpc-js";
import { Stream, Transform, TransformCallback } from "stream";

export type IStreamDataFunction<Receive, Send> = (chunk: Receive) => Send;

export class StreamGrpcAdapter {
  sendByStream<Receive, Send>(
    grpc: ServerWritableStream<any, Send> | ServerDuplexStream<any, Send>,
    onData: IStreamDataFunction<Receive, Send>,
    stream: Stream,
  ): Promise<void> {
    const transform = new Transform({
      transform: (chunk: Receive, _e: BufferEncoding, callback: TransformCallback) => {
        const request = onData(chunk);
        grpc.write(request, callback);
      },
    });

    return new Promise<void>(function (resolve, reject) {
      stream
        .pipe(transform)
        .on("error", (err: Error) => {
          grpc.destroy(err);
          reject(err);
        })
        .on("finish", () => {
          grpc.end();
          resolve();
        });
    });
  }
}
