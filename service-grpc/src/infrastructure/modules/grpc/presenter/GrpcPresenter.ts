import { NotFoundError, ValidationError } from "@core/error/errors";
import { GrpcInternalServerError, GrpcNotFound, GrpcValidationError } from "@core/error/grpc";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";

export class GrpcPresenter {
  static toEmpty(): Empty {
    return new Empty();
  }

  static toError(error: Error): GrpcValidationError | GrpcNotFound | GrpcInternalServerError {
    if (error instanceof ValidationError) return new GrpcValidationError(error.message, error.fields);
    if (error instanceof NotFoundError) return new GrpcNotFound(error.message, error.fields);
    return new GrpcInternalServerError(error.message, error.stack);
  }
}
