import "reflect-metadata";

import Module from "@core/Module";
import getFilesFromPath from "@utils/getFilesFromPath";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import { Container } from "inversify";
import { colors } from "@core/Logger";

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
    const services = await getFilesFromPath<any>(this.config.paths.grpc.services);
    for (const { file: service, name } of services) {
      if (!service) continue;

      const pLog = "[GrpcModule] [Server] [Service]";
      this.logger.debug(`🕹️  ${pLog} [create] => ${colors.gray(name)}`);
      const { file: definition } = definitions.find((file) => file.name === name);
      this.container.bind(Symbol.for(name)).to(service);

      for (const { path } of Object.values(definition) as any)
        this.logger.info(`📂  ${pLog} [route] => ${colors.info(path)}`);
      this.server.addService(definition, this.container.get(Symbol.for(name)));
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
