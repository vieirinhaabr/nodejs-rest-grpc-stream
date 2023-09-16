export interface IErrorReport {
  field?: string;
  message?: string;
}

export abstract class CustomError extends Error {
  constructor(message: string, reports?: IErrorReport[]) {
    super(message);
    this.reports = reports || [];
  }

  code: number;
  reports?: IErrorReport[];
}

export class ValidationError extends CustomError {
  constructor(reports: IErrorReport[], message = "Parameters validation error.") {
    super(message, reports);
  }
}

export class NotFoundError extends CustomError {
  constructor(reports: IErrorReport[], message = "Parameters not found error.") {
    super(message, reports);
  }
}

export class InternalServer extends CustomError {
  constructor(message = "Internal Server Error.") {
    super(message);
  }
}
