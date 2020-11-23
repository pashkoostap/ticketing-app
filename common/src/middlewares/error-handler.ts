import { NextFunction, Request, Response } from 'express';

import { CustomError, BadRequestError } from '../errors';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send(err.serializeError());
  }

  if (err instanceof BadRequestError) {
    return res.status(err.statusCode).send(err.serializeError());
  }

  console.error(err);

  res.status(400).send({ message: 'Something went wrong' });
};
