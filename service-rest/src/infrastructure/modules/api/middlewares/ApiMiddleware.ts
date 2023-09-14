import { ILogger } from "@core/Logger";
import { NextFunction, Request, Response } from "express";

export class ApiMiddleware {
  protected logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  async handler(req: Request, res: Response, next: NextFunction): Promise<void> {
    throw new Error("handler method not implemented.");
  }
}
