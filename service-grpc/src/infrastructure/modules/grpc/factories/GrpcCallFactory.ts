import { ILogger, colors } from "@core/Logger";
import { CustomError, NotFoundError, ValidationError } from "@core/error/errors";
import { GrpcDefaultError, GrpcInternalServerError, GrpcNotFound, GrpcValidationError } from "@core/error/grpc";
import {
  ServerDuplexStream,
  ServerReadableStream,
  ServerUnaryCall,
  ServerWritableStream,
  sendUnaryData,
} from "@grpc/grpc-js";
import { get } from "lodash";

type IGrpcCall<P, R> = ServerUnaryCall<P, R> | IGrpcStreamingCall<P, R>;

type IGrpcStreamingCall<P, R> = ServerReadableStream<P, R> | ServerWritableStream<P, R> | ServerDuplexStream<P, R>;

export class GrpcCallFactory {
  static createHandle<F>(logger: ILogger, func: F): F {
    return async function (call: IGrpcCall<any, any>, cb: sendUnaryData<any>): Promise<void> {
      let error: GrpcDefaultError;
      const start = Date.now();
      const rawPath = get(call, "call.handler.path");
      const [id, path] = [`📨  [GrpcModule] [Server]`, `${colors.info(`${rawPath}`)}`];

      try {
        logger.info(`${id} => ${path}`);
        await (func as any)(call, cb);
      } catch (err: any) {
        const { message, reports, stack } = err as CustomError;

        if (err instanceof ValidationError) error = new GrpcValidationError(message, reports);
        else if (err instanceof NotFoundError) error = new GrpcNotFound(message, reports);
        else error = new GrpcInternalServerError(message, stack);

        logger.error(`${id} <> ${path}`);
        logger.error(JSON.stringify({ path: rawPath, error: err }));

        if (cb) cb(error, null);
        else (call as IGrpcStreamingCall<any, any>).destroy(error);
      } finally {
        const rsCode = error ? colors.error(`[ERROR]`) : colors.success(`[OK]`);
        const duration = `${colors.gray(`${Date.now() - start} ms`)}`;

        logger.info(`${id} <= ${rsCode} ${path} ${duration}`);
      }
    } as F;
  }
}
