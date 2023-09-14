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

export enum ELoggerCollors {
  GREEN = "\x1b[32m",
  GRAY = "\x1b[30m",
  CIAN = "\x1b[36m",
  RED = "\x1b[31m",
  YELLOW = "\x1b[33m",
  PURPLE = "\x1b[34m",
  PINK = "\x1b[35m",
}
