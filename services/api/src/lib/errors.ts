// Base HTTP error class with status code
export class HttpError extends Error {
  constructor(
    public status: number,
    public error: string,
    message?: string,
  ) {
    super(message || error);
    this.name = 'HttpError';
  }
}

// Common HTTP errors
export class BadRequestError extends HttpError {
  constructor(error: string, message?: string) {
    super(400, error, message);
    this.name = 'BadRequestError';
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message?: string) {
    super(401, 'Unauthorized', message || 'Authentication required');
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends HttpError {
  constructor(message?: string) {
    super(403, 'Forbidden', message || 'Insufficient permissions');
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends HttpError {
  constructor(resource?: string) {
    const message = resource ? `${resource} not found` : 'Resource not found';
    super(404, 'Not found', message);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends HttpError {
  constructor(error: string, message?: string) {
    super(409, error, message);
    this.name = 'ConflictError';
  }
}

export class InternalServerError extends HttpError {
  constructor(message?: string) {
    super(500, 'Internal server error', message || 'Something went wrong');
    this.name = 'InternalServerError';
  }
}
