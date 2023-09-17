import { NextFunction, Request, Response } from "express";
import { ILogger, colors } from "@core/Logger";
import { isEmpty } from "lodash";
import { CustomError, NotFoundError, ValidationError } from "@core/error/errors";
import { Stream } from "stream";

import { IResquestHandler } from "../interfaces/IRoute";
import { IErrorResponse } from "../interfaces/IErrorResponse";

export class ApiCallFactory {
  static createHandle(logger: ILogger, route: IResquestHandler) {
    return async function (req: Request, res: Response, next: NextFunction) {
      let code = 200;
      const start = Date.now();
      const [id, path] = [`📨  [ApiModule] [Server]`, `${colors.info(`${req.method} ${req.url}`)}`];

      try {
        logger.info(`${id} => ${path}`);
        const response = await route(req, res, next);

        if (response instanceof Stream) return;
        if (isEmpty(response)) code = 201;
        res.status(code).send(response);
      } catch (err: any) {
        const { message, reports, stack } = err as CustomError;

        let error: IErrorResponse;
        if (err instanceof ValidationError) {
          code = 412;
          error = { message, reports, stack };
        } else if (err instanceof NotFoundError) {
          code = 412;
          error = { message, reports, stack };
        } else {
          code = 500;
          error = { message, stack };
        }

        logger.error(`${id} <> ${path}`);
        logger.error(JSON.stringify({ code, method: req.method, url: req.url, error }));
        logger.error(JSON.stringify({ params: req.params, headers: req.headers, body: req.body }));

        res.status(code).send(error);
      } finally {
        const rsCode = code > 204 ? colors.error(`[${code}]`) : colors.success(`[${code}]`);
        const duration = `${colors.gray(`${Date.now() - start} ms`)}`;
        const agent = colors.gray(`(${req.headers["user-agent"] ?? "not_defined"})`);

        logger.info(`${id} <= ${rsCode} ${path} ${duration} ${agent}`);
      }
    };
  }
}
