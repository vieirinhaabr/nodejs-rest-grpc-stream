import { Metadata, ServerErrorResponse, status } from "@grpc/grpc-js";
import { GrpcDefaultError } from "./grpc";

interface ErrorResponse {
  code: number;
  content: {
    message: string;
    field?: any[];
  };
}

export class ErrorsTransform {
  grpcToHttp(error: ServerErrorResponse): ErrorResponse {
    const content = { message: error.message, field: this.getErrorFields(error.metadata) };
    return {
      code: this.translateGrpcCode(error.code),
      content,
    };
  }

  getErrorFields(metadata: Metadata): any[] {
    try {
      return GrpcDefaultError.getErrorFields(metadata);
    } catch {
      return;
    }
  }

  translateGrpcCode(code: status | undefined): number {
    switch (code) {
      case status.INTERNAL:
        return 500;
      case status.NOT_FOUND:
        return 404;
      case status.INVALID_ARGUMENT:
        return 412;
      case status.FAILED_PRECONDITION:
        return 412;
      default:
        return 500;
    }
  }
}
