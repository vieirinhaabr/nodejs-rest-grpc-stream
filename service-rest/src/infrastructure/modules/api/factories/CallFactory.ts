import { NextFunction, Request, Response } from "express";
import { ILogger } from "@core/Logger";
import { isEmpty } from "lodash";
import { IResquestHandler } from "../interfaces/IRoute";

export class CallFactory {
  static createHandle(logger: ILogger, route: IResquestHandler) {
    return async function (req: Request, res: Response, next: NextFunction) {
      try {
        const response = await route(req, res, next);

        if (isEmpty(response)) res.status(201).send();
        else res.status(200).send(response);
      } catch (error) {
        logger.error(error.message);
        logger.error("ERRSRSR MIDD");
        res.status(488).send(error.message);
      }
    };
  }
}
