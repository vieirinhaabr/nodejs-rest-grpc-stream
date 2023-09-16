import "reflect-metadata";

import Module from "@core/Module";
import getFilesFromPath from "@utils/getFilesFromPath";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import { Container } from "inversify";
import { colors } from "@core/Logger";
import { GrpcCallFactory } from "./factories/GrpcCallFactory";

export default class GrpcModule extends Module {
  private server!: Server;

  static async build(container: Container): Promise<GrpcModule> {
    const module = new GrpcModule(container);
    await module.configureServer();
    return module;
  }

  private async configureServer(): Promise<void> {
    this.logger.debug(`📦  [GrpcModule] => ${colors.gray("Configure")}`);

    this.server = new Server();
  }

  async in(): Promise<void> {
    this.logger.debug(`🕹️  [GrpcModule] [Server] => ${colors.gray("Start")}`);

    const definitions = await getFilesFromPath<any>(this.config.paths.grpc.definitions);
    const implementations = await getFilesFromPath<any>(this.config.paths.grpc.services);
    for (const { file: implementation, name } of implementations) {
      if (!implementation) continue;

      const pLog = "[GrpcModule] [Server] [Service]";
      this.logger.debug(`🕹️  ${pLog} [create] => ${colors.gray(name)}`);

      const { file: definition } = definitions.find((file) => file.name === name);
      this.container.bind(Symbol.for(name)).to(implementation);
      const service = this.container.get<any>(Symbol.for(name));

      const router: typeof definition = {};
      for (const [route, { path }] of Object.entries(definition) as any) {
        this.logger.info(`📂  ${pLog} [route] => ${colors.info(path)}`);
        router[route] = GrpcCallFactory.createHandle(this.logger, service[route].bind(service));
      }

      this.server.addService(definition, router);
    }

    const { port } = this.config.grpc;
    return new Promise((resolve, reject) => {
      this.server.bindAsync(`0.0.0.0:${port}`, ServerCredentials.createInsecure(), (error) => {
        if (error) return reject(error);

        this.server.start();
        this.logger.info(`🌐  [GrpcModule] [Server] => ${colors.success(`Listening on port ${port}`)}`);

        return resolve();
      });
    });
  }

  async stop(): Promise<void> {
    this.logger.debug(`🛑  [GrpcModule] [Server] => ${colors.gray("Stop")}`);
    this.server.forceShutdown();
  }
}
