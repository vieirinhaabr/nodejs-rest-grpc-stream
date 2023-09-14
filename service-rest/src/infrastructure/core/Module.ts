import { Container } from "inversify";

import { IAppConfig } from "./AppConfig";
import TYPES from "./Types";
import { ILogger } from "./Logger";

export default class Module {
  protected logger: ILogger;
  protected container: Container;
  protected config: IAppConfig;

  constructor(container: Container) {
    this.container = container;
    this.logger = container.get<ILogger>(TYPES.Logger);
    this.config = container.get<IAppConfig>(TYPES.AppConfig);
  }

  static build(container: Container): Promise<Module> {
    throw new Error("build method not implemented.");
  }

  start(): Promise<void> {
    throw new Error("start method not implemented.");
  }

  stop(): Promise<void> {
    throw new Error("stop method not implemented.");
  }
}
