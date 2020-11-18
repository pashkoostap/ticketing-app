import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import {
  currentUser,
  errorHandler,
  NotFoundError,
} from '@pashkoostap-learning/ticketing-common';
import { createPaymentRouter } from './routes';

export const app = express();

app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUser);
app.use(createPaymentRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);
