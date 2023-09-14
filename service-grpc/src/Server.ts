/* eslint-disable @typescript-eslint/no-extra-semi */
import "reflect-metadata";

import Module from "@core/Module";
import fg from "fast-glob";
import { Container } from "inversify";
import resolvePath from "@utils/resolvePath";
import config, { IAppConfig } from "@core/AppConfig";
import IoC from "@core/IoC";
import TYPES from "@core/Types";
import { ILogger, createLogger } from "@core/Logger";

const buildModules = async (ioc: IoC, logger: ILogger) => {
  const modules: Array<typeof Module> = await Promise.all(
    fg.sync(resolvePath(...config.paths.modules)).map(async (file) => (await import(`${file}`)).default),
  );

  logger.debug("⚙️ [run] [modules] => Build");
  const buildedModules: Array<Module> = await Promise.all(modules.map((module) => module.build(ioc.getContainer())));

  logger.debug("⚙️ [run] [modules] => Start");
  for (const module of buildedModules) {
    await module.start();
  }
};

async function run(): Promise<void> {
  const logger = createLogger();
  logger.info("🚧 [run] => Init");
  const ioc = new IoC(logger, config);
  ioc.build();
  const container = ioc.getContainer();

  container.bind<IAppConfig>(TYPES.AppConfig).toConstantValue(config);
  container.bind<Container>(TYPES.Container).toConstantValue(container);
  container.bind<ILogger>(TYPES.Logger).toConstantValue(logger);

  await buildModules(ioc, logger);

  logger.info("🚧 [run] => Finish");
}

// eslint-disable-next-line prettier/prettier
(async () => {
  await run();
})();
