import { ILogger } from "@core/Logger";
import TYPES from "@core/Types";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { Get, Post, Router } from "../decorators";
import DefaultApiMiddleware from "../middlewares/DefaultApiMiddleware";

@injectable()
@Router("/stream", DefaultApiMiddleware.name)
export default class StreamApiController {
  constructor(@inject(TYPES.Logger) private logger: ILogger) {}

  @Post("/upstream")
  async upstream(req: Request, res: Response): Promise<void> {
    const body = req.body;
    this.logger.info(JSON.stringify(body));
    res.json().send();
  }

  @Get("/downstream")
  async downstream(req: Request, res: Response): Promise<void> {
    const body = req.body;
    this.logger.info(JSON.stringify(body));
    res.json().send();
  }

  @Post("/duplex")
  async duplex(req: Request, res: Response): Promise<void> {
    const body = req.body;
    this.logger.info(JSON.stringify(body));
    res.json().send();
  }
}
