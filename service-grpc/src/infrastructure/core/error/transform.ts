import { ServerErrorResponse, status } from "@grpc/grpc-js";
import { CustomError, InternalServer, NotFoundError, ValidationError } from "./errors";
import { GrpcDefaultError, GrpcInternalServerError, GrpcNotFound, GrpcValidationError } from "./grpc";

export class ErrorTransform {
  static isGrpcError(error: unknown): boolean {
    return error?.hasOwnProperty("metadata");
  }

  static toGrpc(error: CustomError): GrpcDefaultError {
    if (ErrorTransform.isGrpcError(error)) {
      return error as GrpcDefaultError;
    }
    if (error instanceof NotFoundError) {
      return new GrpcNotFound(error.message, error.fields, error.stack);
    }
    if (error instanceof ValidationError) {
      return new GrpcValidationError(error.message, error.fields, error.stack);
    }
    return new GrpcInternalServerError(error.message, error.stack);
  }

  static fromGrpc(error: ServerErrorResponse): CustomError {
    const fields = GrpcDefaultError.getErrorFields(error.metadata);
    const message = error.message;

    switch (error.code) {
      case status.NOT_FOUND:
        const notfound = new NotFoundError(fields, message);
        notfound.stack = error.stack;
        return notfound;
      case status.INVALID_ARGUMENT:
        const invalidArgument = new ValidationError(fields, message);
        invalidArgument.stack = error.stack;
        return invalidArgument;
      default:
        const internal = new InternalServer(fields, message);
        internal.stack = error.stack;
        return internal;
    }
  }
}
