import { Elysia } from 'elysia';
import { HttpError } from '../lib/errors';

export const errorHandler = new Elysia({ name: 'error-handler' })
  .onError(({ error, set }) => {
    console.error('API Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    // Handle custom HttpError instances
    if (error instanceof HttpError) {
      set.status = error.status;
      return {
        error: error.error,
        message: error.message,
      };
    }

    // Handle built-in validation errors
    if (error.name === 'ValidationError') {
      set.status = 400;
      return {
        error: 'Validation failed',
        message: error.message,
      };
    }

    // Default internal server error
    set.status = 500;
    return {
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    };
  });