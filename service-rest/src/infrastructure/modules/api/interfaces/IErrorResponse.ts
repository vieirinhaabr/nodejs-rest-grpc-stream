import { IErrorReport } from "@core/error/errors";

export interface IErrorResponse {
  message?: string;
  reports?: IErrorReport[];
  stack?: string;
}
