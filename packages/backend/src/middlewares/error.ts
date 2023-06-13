import { Request, Response, NextFunction } from 'express';
import HttpException from '../exceptions/HttpException';

const errorMiddleware = async (
  error: HttpException,
  _request: Request,
  response: Response,
  _next: NextFunction
) => {
  const status = error.status || 500;
  const message =
    typeof error.message === 'string' ? error.message : String(error);

  if (process.env.NODE_ENV !== 'test' || process.env.TEST_LOG === 'on') {
    console.log(message); // eslint-disable-line no-console
  }

  response.status(status).send({
    status,
    message,
  });
};

export default errorMiddleware;
