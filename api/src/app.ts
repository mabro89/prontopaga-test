import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import {
  errorHandler,
  notFoundHandler,
} from './shared/infrastructure/http/middlewares/error.middleware.js';
import { buildAppDependencies } from './container.js';

export const createApp = (): Application => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN,
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  const { authRouter, userRouter, seedInitialData } = buildAppDependencies();
  void seedInitialData();

  app.use('/api/auth', authRouter);
  app.use('/api/users', userRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
