import { Elysia } from 'elysia';
import { logify } from '@rasla/logify';

const logger = logify({
  level: process.env.LOG_LEVEL || 'info',
  service: 'saas-starter-api',
});

export const requestLoggerPlugin = new Elysia({ name: 'request-logger' })
  .derive(({ request }) => {
    const startTime = Date.now();
    return { startTime, logger };
  })
  .onRequest(({ request, logger }) => {
    logger.info('Request started', {
      method: request.method,
      url: request.url,
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
    });
  })
  .onAfterHandle(({ request, set, startTime, logger }) => {
    const duration = Date.now() - startTime;
    
    logger.info('Request completed', {
      method: request.method,
      url: request.url,
      status: set.status,
      duration,
    });
  })
  .onError(({ request, error, startTime, logger }) => {
    const duration = Date.now() - startTime;
    
    logger.error('Request failed', {
      method: request.method,
      url: request.url,
      error: error.message,
      duration,
    });
  });