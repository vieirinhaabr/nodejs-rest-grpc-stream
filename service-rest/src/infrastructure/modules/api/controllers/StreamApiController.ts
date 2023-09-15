import { ILogger } from "@core/Logger";
import TYPES from "@core/Types";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IUpStreamUseCase } from "@interface/IUpStream";
import { IDownStreamUseCase } from "@interface/IDownStream";
import { IDuplexStreamUseCase } from "@interface/IDuplexStream";
import { ReadStream } from "fs";

import { Get, Post, Router } from "../decorators";
import DefaultApiMiddleware from "../middlewares/DefaultApiMiddleware";
import busboy from "busboy";

@injectable()
@Router("/stream", DefaultApiMiddleware.name)
export default class StreamApiController {
  constructor(
    @inject(TYPES.Logger) private logger: ILogger,
    @inject(TYPES.UpStreamUseCase) private upStreamUseCase: IUpStreamUseCase,
    @inject(TYPES.DownStreamUseCase) private downStreamUseCase: IDownStreamUseCase,
    @inject(TYPES.DuplexStreamUseCase) private duplexStreamUseCase: IDuplexStreamUseCase,
  ) {}

  @Post("/upstream")
  async upstream(req: Request & ReadStream): Promise<void> {
    return this.upStreamUseCase.execute({ req });
  }

  @Get("/downstream")
  async downstream(req: Request, res: Response): Promise<void> {
    throw new Error("rerer");
    //const stream = await this.downStreamUseCase.execute();
    //res.attachment("file.csv");
    //stream.pipe(res);
  }

  @Post("/duplex")
  async duplex(req: Request, res: Response): Promise<void> {
    const body = req.body;
    this.logger.info(JSON.stringify(body));
    res.json().send();
  }
}
