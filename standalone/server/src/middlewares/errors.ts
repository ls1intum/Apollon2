import { NextFunction, Request, Response } from "express"
import { log } from "../logger"

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  log.error(err)
  res.status(500).send({ errors: [{ message: "Something went wrong" }] })
}
