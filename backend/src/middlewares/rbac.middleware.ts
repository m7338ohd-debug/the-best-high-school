import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../shared/errors/api.error.js';

/**
 * Role-based access control middleware factory.
 * @param allowedRoles List of roles permitted to access the endpoint
 */
export const requireRoles = (...allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError('User authentication context is missing'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError(`User role '${req.user.role}' is not authorized to perform this operation`));
    }

    next();
  };
};
