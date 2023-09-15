import "reflect-metadata";

import Module from "@core/Module";
import getFilesFromPath from "@utils/getFilesFromPath";
import { Container } from "inversify";
import { colors } from "@core/Logger";

import { GrpcClient } from "./clients/GrpcClient";

export default class GrpcModule extends Module {
  static async build(container: Container): Promise<GrpcModule> {
    const module = new GrpcModule(container);
    await module.configureServer();
    return module;
  }

  private async configureServer(): Promise<void> {
    this.logger.debug(`📦  [GrpcModule] => ${colors.gray("Configure")}`);
  }

  async out(): Promise<void> {
    this.logger.debug(`🕹️  [GrpcModule] [Client] => ${colors.gray("Start")}`);

    const clients = await getFilesFromPath<typeof GrpcClient>(this.config.paths.grpc.clients);
    for (const { file: client, name } of clients) {
      if (!client) continue;

      this.logger.debug(`🕹️  [GrpcModule] [Client] [create] => ${colors.gray(name)}`);
      this.container.bind(Symbol.for(name)).toConstantValue(client.build(this.config));
    }

    const actions = await getFilesFromPath<any>(this.config.paths.grpc.actions);
    for (const { file: action, name } of actions) {
      if (!action) continue;

      this.logger.debug(`🕹️  [GrpcModule] [Client] [Action] [create] => ${colors.gray(name)}`);
      this.container.bind(Symbol.for(name)).to(action);
    }
  }

  async stop(): Promise<void> {
    this.logger.debug(`🛑  [GrpcModule] [Client] => ${colors.gray("Stop")}`);
  }
}
