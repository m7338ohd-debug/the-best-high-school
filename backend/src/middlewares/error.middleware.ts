import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../shared/errors/api.error.js';
import { LoggerService } from '../shared/logger/logger.service.js';
import { ZodError } from 'zod';

export const errorMiddleware = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  const timestamp = new Date().toISOString();

  // Handle custom API errors
  if (err instanceof ApiError) {
    LoggerService.warn(`[API Error] ${err.statusCode} - ${err.message}`, { errors: err.errors });
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: err.errors || null,
      code: err.statusCode,
      timestamp: err.timestamp || timestamp,
    });
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    LoggerService.warn(`[Validation Error] ${err.message}`, { issues: err.issues });
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: err.flatten().fieldErrors,
      code: 400,
      timestamp,
    });
  }

  // Handle uncaught internal server errors
  LoggerService.error(`[Unhandled Error] ${err.message}`, err);
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred',
    code: 500,
    timestamp,
  });
};
