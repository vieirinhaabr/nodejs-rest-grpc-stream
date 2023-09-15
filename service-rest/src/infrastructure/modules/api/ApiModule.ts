import "reflect-metadata";

import Module from "@core/Module";
import getFilesFromPath from "@utils/getFilesFromPath";
import { Container } from "inversify";
import express, { Express } from "express";
import { createServer, Server } from "http";
import morgan from "morgan";
import concatPaths from "@utils/concatPaths";
import { ELoggerCollors } from "@core/Logger";
import TYPES from "@core/Types";

import { ApiMiddleware } from "./middlewares/ApiMiddleware";
import { RouteFactory } from "./factories/RouteFactory";
import { CallFactory } from "./factories/CallFactory";

export default class ApiModule extends Module {
  server: Server;
  app: Express;

  static async build(container: Container): Promise<ApiModule> {
    const module = new ApiModule(container);
    await module.configureServer();
    return module;
  }

  private async configureServer(): Promise<void> {
    this.logger.debug(`📦  [ApiModule] => ${ELoggerCollors.GRAY} Configure`);

    this.app = express();
    this.app.use(express.json());
    this.app.use(
      morgan(
        `📨  [ApiModule] [Server] => ${ELoggerCollors.PINK}[:status] ${ELoggerCollors.CIAN}:method :url ${ELoggerCollors.GRAY}:response-time ms - :user-agent`,
        {
          stream: { write: (message) => this.logger.info(message.substring(0, message.lastIndexOf("\n"))) },
        },
      ),
    );

    this.server = createServer(this.app);
  }

  async in(): Promise<void> {
    this.logger.debug(`🕹️  [ApiModule] [Server] => ${ELoggerCollors.GRAY} Start`);

    const { prefix = "", port } = this.config.api;

    const middlewares = await getFilesFromPath<any>(this.config.paths.api.middlewares);
    for (const { file: middleware, name } of middlewares) {
      if (!middleware) continue;

      this.logger.debug(`🕹️  [ApiModule] [Server] [Middleware] [create] => ${ELoggerCollors.GRAY} ${name}`);
      this.container.bind(Symbol.for(name)).to(middleware);
    }

    const controllers = await getFilesFromPath<any>(this.config.paths.api.controllers);
    const pLog = "[ApiModule] [Server] [Controller]";
    for (const { file: rawController, name } of controllers) {
      if (!rawController) continue;

      this.logger.debug(`🕹️  ${pLog} [create] => ${ELoggerCollors.GRAY} ${name}`);
      this.container.bind(Symbol.for(name)).to(rawController);

      const service = this.container.get(Symbol.for(name));
      const controller = RouteFactory.createController(service);
      const routes = RouteFactory.createRoutes(service);

      const router = express.Router();

      const middlewares: ApiMiddleware["handler"][] = [];
      if (controller.middleware) {
        const middleware = this.container.get<ApiMiddleware>(Symbol.for(controller.middleware));
        middlewares.push(middleware.handler.bind(middleware));
      }

      router.use(controller.path, ...middlewares);

      for (const route of routes) {
        const middlewares: ApiMiddleware["handler"][] = [];
        if (route.middleware) {
          const middleware = this.container.get<ApiMiddleware>(Symbol.for(route.middleware));
          middlewares.push(middleware.handler.bind(middleware));
        }

        const path = concatPaths(prefix, controller.path, route.path);
        this.logger.debug(`📂  ${pLog} [route] => ${ELoggerCollors.CIAN} ${route.method.toUpperCase()} ${path}`);
        router[route.method](path, ...middlewares, CallFactory.createHandle(this.logger, route.handler));
      }

      this.app.use(router);
    }

    return new Promise((resolve) => {
      this.server.listen(port, () => {
        this.logger.info(`🌐  [ApiModule] [Server] => ${ELoggerCollors.GREEN} Listening on port ${port}`);
        resolve();
      });
    });
  }

  async stop(): Promise<void> {
    this.logger.debug(`🛑  [ApiModule] [Server] => ${ELoggerCollors.GRAY} Stop`);

    return new Promise((resolve, reject) => {
      this.server.close((err) => {
        if (err) {
          this.logger.error(
            `🛑  [ApiModule] [Server] => ${ELoggerCollors.GRAY} Could not close connection ${err.message}`,
          );
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
