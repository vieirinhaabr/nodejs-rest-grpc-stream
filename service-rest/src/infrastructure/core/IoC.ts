import "reflect-metadata";

import { Container } from "inversify";
import getFilesFromPath from "@utils/getFilesFromPath";

import { IAppConfig } from "./AppConfig";
import { ELoggerCollors, ILogger } from "./Logger";

export default class IoC {
  private logger: ILogger;
  private config: IAppConfig;
  private container: Container;

  public constructor(
    logger: ILogger,
    config: IAppConfig,
    container: Container = new Container({ skipBaseClassChecks: true }),
  ) {
    this.logger = logger;
    this.config = config;
    this.container = container;
  }

  getContainer(): Container {
    return this.container;
  }

  async build(): Promise<void> {
    // UseCases
    this.logger.debug(`📦  [IoC] [UseCases] => ${ELoggerCollors.GRAY} Build`);
    const usecases = await getFilesFromPath<any>(this.config.paths.useCases);
    for (const { file: usecase, name } of usecases) {
      if (!usecase) continue;

      this.logger.debug(`📦  [IoC] [UseCase] [create] => ${ELoggerCollors.GRAY} ${name}`);
      this.container.bind(Symbol.for(name)).to(usecase);
    }
  }
}
