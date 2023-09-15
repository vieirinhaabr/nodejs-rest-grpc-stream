import winston, { format, Logform, transports } from "winston";
import { redBright, yellowBright, greenBright, cyanBright, magentaBright, blackBright, blueBright } from "cli-color";

export interface ILogger {
  info: (message: string) => ILogger;
  error: (message: string) => ILogger;
  debug: (message: string) => ILogger;
  warn: (message: string) => ILogger;
  log: (message: string) => ILogger;
}

const formatLog = format.printf(({ level, message }: Logform.TransformableInfo) => {
  let msg = `${level}: ${message}`;
  return msg;
});

export const createLogger = (): ILogger => {
  return winston.createLogger({
    format: format.combine(format.colorize(), format.simple(), formatLog),
    level: "debug",
    transports: [new transports.Console()],
  }) as any;
};

export const colors = {
  error: redBright,
  warn: yellowBright,
  success: greenBright,
  info: cyanBright,
  magenta: magentaBright,
  gray: blackBright,
  blue: blueBright,
};
