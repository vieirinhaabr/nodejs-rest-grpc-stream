import env from "env-var";

export interface IAppConfig {
  grpc: {
    port: number;
  };
  paths: {
    modules: string[];
    useCases: string[];
    grpc: {
      definitions: string[];
      services: string[];
    };
  };
}

const getConfig = (): IAppConfig => {
  return {
    grpc: {
      port: env.get("GRPC_PORT").required().asInt(),
    },
    paths: {
      modules: [__dirname, "", "..", "modules", "**", "*Module.(t|j)s"],
      useCases: [__dirname, "", "..", "..", "app", "*UseCase.(t|j)s"],
      grpc: {
        definitions: [__dirname, "", "..", "modules", "grpc", "definitions", "*Service.(t|j)s"],
        services: [__dirname, "", "..", "modules", "grpc", "services", "*Service.(t|j)s"],
      },
    },
  };
};

export default getConfig();
