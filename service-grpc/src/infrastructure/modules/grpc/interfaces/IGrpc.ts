import {
  ServerDuplexStream,
  ServerReadableStream,
  ServerUnaryCall,
  ServerWritableStream,
  sendUnaryData,
} from "@grpc/grpc-js";

export type IGrpcCall<P, R> = ServerUnaryCall<P, R> | IGrpcStreamingCall<P, R>;

export type IGrpcStreamingCall<P, R> =
  | ServerReadableStream<P, R>
  | ServerWritableStream<P, R>
  | ServerDuplexStream<P, R>;

export type IGrpcFunction<P, R> =
  | ((call: ServerUnaryCall<P, R>, cb: sendUnaryData<R>) => Promise<void>)
  | ((call: ServerReadableStream<P, R>, cb: sendUnaryData<R>) => Promise<void>)
  | ((call: ServerWritableStream<P, R>) => Promise<void>)
  | ((call: ServerDuplexStream<P, R>) => Promise<void>);
