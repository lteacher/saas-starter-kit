import { Elysia } from 'elysia';
import { logger, LogLevel } from '@rasla/logify';

export const requestLoggerPlugin = new Elysia({ name: 'request-logger' }).use(
  logger({
    level: (process.env.LOG_LEVEL as LogLevel) || 'info',
  }),
);
