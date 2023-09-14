import { Metadata, MetadataValue, ServerErrorResponse, status } from "@grpc/grpc-js";

interface FieldMetadata {
  field?: string;
  message?: string;
}

export class GrpcDefaultError implements ServerErrorResponse {
  code?: status;
  details?: string;
  metadata?: Metadata;
  name: string;
  message: string;
  stack?: string;

  constructor(message: string, code: status) {
    this.message = message;
    this.code = code;

    if (!this.metadata) this.metadata = new Metadata();
  }

  static getErrorFields(metadata: Metadata | undefined): FieldMetadata[] {
    return Object.values(metadata.getMap())
      .map((metadata: MetadataValue): FieldMetadata => {
        try {
          const { field, message } = JSON.parse(metadata.toString());
          return {
            field,
            message,
          };
        } catch (e) {}
      })
      .filter((metadata) => metadata);
  }

  addFields(fields: FieldMetadata[]): void {
    for (const index in fields) {
      this.metadata.add(index, JSON.stringify(fields[index]));
    }
  }
}

export class GrpcInternalServerError extends GrpcDefaultError {
  constructor(message = "Internal Server Error", stack?: string) {
    super(message, status.INTERNAL);
    this.name = GrpcInternalServerError.name;
    this.stack = stack;
  }
}

export class GrpcNotFound extends GrpcDefaultError {
  constructor(message = "Not found", fields: FieldMetadata[], stack?: string) {
    super(message, status.NOT_FOUND);
    this.name = GrpcNotFound.name;
    this.stack = stack;
    this.addFields(fields);
  }
}

export class GrpcValidationError extends GrpcDefaultError {
  constructor(message = "Validation error", fields: FieldMetadata[], stack?: string) {
    super(message, status.INVALID_ARGUMENT);
    this.name = GrpcValidationError.name;
    this.stack = stack;
    this.addFields(fields);
  }
}
