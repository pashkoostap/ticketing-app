import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import {
  errorHandler,
  NotFoundError,
} from '@pashkoostap-learning/ticketing-common';
import {
  currentUserRouter,
  signinRouter,
  signoutRouter,
  signupRouter,
} from './routes';

export const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use(currentUserRouter);
app.use(signupRouter);
app.use(signoutRouter);
app.use(signinRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);
