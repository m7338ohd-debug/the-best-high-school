import { Request, Response, NextFunction } from 'express';
import { TenantContext } from '../shared/context/tenant.context.js';

/**
 * Enterprise Middleware that resolves and sets tenant context once per request.
 * Resolves from `x-tenant-id` header, domain query parameter, or defaults to `system-global`.
 */
export const tenantMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  const resolvedTenantId = (req.headers['x-tenant-id'] as string) || (req.query.tenantId as string) || 'system-global';

  TenantContext.run({ tenantId: resolvedTenantId }, () => {
    next();
  });
};
