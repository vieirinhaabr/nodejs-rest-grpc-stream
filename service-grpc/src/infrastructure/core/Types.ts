const TYPES = {
  // Rnd
  Container: Symbol.for("Container"),
  Logger: Symbol.for("Logger"),
  AppConfig: Symbol.for("AppConfig"),

  // GRPC Services
  StreamGrpcService: Symbol.for("StreamGrpcService"),

  // UseCases
  UpStreamUseCase: Symbol.for("UpStreamUseCase"),
  DownStreamUseCase: Symbol.for("DownStreamUseCase"),
  DuplexStreamUseCase: Symbol.for("DuplexStreamUseCase"),
};

export default TYPES;
