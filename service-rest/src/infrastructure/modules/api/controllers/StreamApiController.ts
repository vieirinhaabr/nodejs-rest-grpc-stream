import { ILogger } from "@core/Logger";
import TYPES from "@core/Types";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IUpStreamUseCase } from "@interface/IUpStream";
import { IDownStreamUseCase } from "@interface/IDownStream";
import { IDuplexStreamUseCase } from "@interface/IDuplexStream";
import { ReadStream } from "fs";
import { Stream } from "stream";

import { Get, Post, Router } from "../decorators";
import DefaultApiMiddleware from "../middlewares/DefaultApiMiddleware";

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
  async downstream(_req: Request, res: Response): Promise<Stream> {
    const stream = await this.downStreamUseCase.execute();
    res.attachment("file.csv");
    stream.pipe(res);
    return stream;
  }

  @Post("/duplex")
  async duplex(req: Request & ReadStream, res: Response): Promise<Stream> {
    const stream = await this.duplexStreamUseCase.execute({ req });
    res.attachment("file.csv");
    stream.pipe(res);
    return stream;
  }
}
