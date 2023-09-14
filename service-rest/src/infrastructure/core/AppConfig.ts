import env from "env-var";

export interface IAppConfig {
  api: {
    prefix?: string;
    port: number;
  };
  grpc: {
    host: string;
  };
  paths: {
    modules: string[];
    useCases: string[];
    grpc: {
      actions: string[];
      clients: string[];
    };
    api: {
      middlewares: string[];
      controllers: string[];
    };
  };
}

const getConfig = (): IAppConfig => {
  return {
    api: {
      prefix: env.get("API_PREFIX").asString(),
      port: env.get("API_PORT").required().asInt(),
    },
    grpc: {
      host: env.get("GRPC_HOST").required().asString(),
    },
    paths: {
      modules: [__dirname, "", "..", "modules", "**", "*Module.(t|j)s"],
      useCases: [__dirname, "", "..", "..", "app", "*UseCase.(t|j)s"],
      grpc: {
        actions: [__dirname, "", "..", "modules", "grpc", "actions", "**", "*Action.(t|j)s"],
        clients: [__dirname, "", "..", "modules", "grpc", "clients", "*Client.(t|j)s"],
      },
      api: {
        middlewares: [__dirname, "", "..", "modules", "api", "middlewares", "*Middleware.(t|j)s"],
        controllers: [__dirname, "", "..", "modules", "api", "controllers", "*Controller.(t|j)s"],
      },
    },
  };
};

export default getConfig();
