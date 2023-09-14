import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import TYPES from "@core/Types";
import { ILogger } from "@core/Logger";

import { ApiMiddleware } from "./ApiMiddleware";

@injectable()
export default class DefaultApiMiddleware extends ApiMiddleware {
  constructor(@inject(TYPES.Logger) logger: ILogger) {
    super(logger);
  }

  async handler(req: Request, res: Response, next: NextFunction): Promise<void> {
    next();
  }
}
