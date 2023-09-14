const TYPES = {
  // Rnd
  Container: Symbol.for("Container"),
  Logger: Symbol.for("Logger"),
  AppConfig: Symbol.for("AppConfig"),

  // API Middlewares
  DefaultApiMiddleware: Symbol.for("DefaultApiMiddleware"),

  // API Controllers
  StreamApiController: Symbol.for("StreamApiController"),

  // GRPC Clients
  StreamGrpcClient: Symbol.for("StreamGrpcClient"),

  // GRPC Actions
  UpStreamGrpcAction: Symbol.for("UpStreamGrpcAction"),
  DownStreamGrpcAction: Symbol.for("DownStreamGrpcAction"),
  DuplexStreamGrpcAction: Symbol.for("DuplexStreamGrpcAction"),

  // UseCases
  UpStreamUseCase: Symbol.for("UpStreamUseCase"),
  DownStreamUseCase: Symbol.for("DownStreamUseCase"),
  DuplexStreamUseCase: Symbol.for("DuplexStreamUseCase"),
};

export default TYPES;
