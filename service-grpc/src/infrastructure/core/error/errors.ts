export interface IErrorReport {
  field?: string;
  message?: string;
}

export abstract class CustomError extends Error {
  constructor(message: string, fields: IErrorReport[]) {
    super(message);
    this.fields = fields;
  }

  name: string;
  code: number;
  fields?: IErrorReport[];
}

export class ValidationError extends CustomError {
  constructor(fields: IErrorReport[], message = "Parameters validation error.") {
    super(message, fields);
  }
}

export class NotFoundError extends CustomError {
  constructor(fields: IErrorReport[], message = "Parameters not found error.") {
    super(message, fields);
  }
}

export class InternalServer extends CustomError {
  constructor(fields?: IErrorReport[], message = "Internal Server Error.") {
    super(message, fields);
  }
}
