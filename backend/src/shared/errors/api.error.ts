/**
 * Base custom API Error class for standard error handling across business modules.
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors?: unknown;
  public readonly timestamp: string;

  constructor(statusCode: number, message: string, errors?: unknown) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;
    this.errors = errors;
    this.timestamp = new Date().toISOString();
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends ApiError {
  constructor(message = 'Bad Request', errors?: unknown) {
    super(400, message, errors);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized access', errors?: unknown) {
    super(401, message, errors);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden resource', errors?: unknown) {
    super(403, message, errors);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found', errors?: unknown) {
    super(404, message, errors);
  }
}

export class ConflictError extends ApiError {
  constructor(message = 'Resource conflict', errors?: unknown) {
    super(409, message, errors);
  }
}

export class InternalServerError extends ApiError {
  constructor(message = 'Internal server error', errors?: unknown) {
    super(500, message, errors);
  }
}
