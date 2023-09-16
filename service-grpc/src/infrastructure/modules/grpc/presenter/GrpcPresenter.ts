import { NotFoundError, ValidationError } from "@core/error/errors";
import { GrpcInternalServerError, GrpcNotFound, GrpcValidationError } from "@core/error/grpc";
import { EmptyMessage } from "../../../../../../proto/dist";

export class GrpcPresenter {
  static toEmpty(): EmptyMessage {
    return new EmptyMessage();
  }

  static toError(error: Error): GrpcValidationError | GrpcNotFound | GrpcInternalServerError {
    if (error instanceof ValidationError) return new GrpcValidationError(error.message, error.reports);
    if (error instanceof NotFoundError) return new GrpcNotFound(error.message, error.reports);
    return new GrpcInternalServerError(error.message, error.stack);
  }
}
