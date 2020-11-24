import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { RequestValidationError } from '../errors';

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(
      'Request validation failed',
      errors.array()
    );
  }

  next();
};
