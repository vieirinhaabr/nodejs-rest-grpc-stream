import winston from "winston";

export interface ILogger {
  info: (message: string) => ILogger;
  error: (message: string) => ILogger;
  debug: (message: string) => ILogger;
  warn: (message: string) => ILogger;
  log: (message: string) => ILogger;
}

export const createLogger = (): ILogger => {
  return winston.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
        level: "debug",
      }),
    ],
  }) as any;
};
