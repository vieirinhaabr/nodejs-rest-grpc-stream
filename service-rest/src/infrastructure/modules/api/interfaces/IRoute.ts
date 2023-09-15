import { NextFunction, Request, Response } from "express";

import { EHttpMethod } from "../enums/EHttpMethod";

export type IResquestHandler = <R>(req: Request, res: Response, next: NextFunction) => Promise<R>;

export interface IRoute {
  method: EHttpMethod;
  path: string;
  handler: IResquestHandler;
  middleware?: string;
}
