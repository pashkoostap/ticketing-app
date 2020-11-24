import { ValidationError } from 'express-validator';

export abstract class CustomError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract statusCode: number;
  abstract serializeError(): {
    message: string;
    errors?: { message: string; field?: string }[];
  };
}

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public message: string, public errors?: ValidationError[]) {
    super(message);

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  public serializeError() {
    return {
      message: this.message,
      errors: this.errors?.map(({ msg, param }) => ({
        message: msg,
        field: param,
      })),
    };
  }
}

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;

  constructor(message = 'Error connection to database') {
    super(message);

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  public serializeError() {
    return {
      message: this.message,
    };
  }
}

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor(message = 'Not found') {
    super(message);

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  public serializeError() {
    return {
      message: 'Not found',
    };
  }
}

export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(message = 'Bad request') {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  public serializeError() {
    return {
      message: this.message,
    };
  }
}

export class NotAuthorizedError extends CustomError {
  statusCode = 401;

  constructor(message = 'Not Authorised') {
    super(message);

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  public serializeError() {
    return {
      message: this.message,
    };
  }
}
