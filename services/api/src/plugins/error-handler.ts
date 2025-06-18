import { Elysia } from 'elysia';
import { HttpError } from '../lib/errors';

export const errorHandler = new Elysia({ name: 'error-handler' }).onError(({ error, set }) => {
  console.error('API Error:', error, new Date().toISOString());

  // Handle custom HttpError instances
  if (error instanceof HttpError) {
    set.status = error.status;
    return {
      error: error.error,
      message: error.message,
    };
  }

  // Default internal server error
  set.status = 500;
  return {
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? String(error) : 'Something went wrong',
  };
});
