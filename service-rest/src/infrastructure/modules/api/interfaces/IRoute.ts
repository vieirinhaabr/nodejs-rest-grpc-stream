import { RequestHandler } from "express";

import { EHttpMethod } from "../enums/EHttpMethod";

export interface IRoute {
  method: EHttpMethod;
  path: string;
  handler: RequestHandler;
  middleware?: string;
}
