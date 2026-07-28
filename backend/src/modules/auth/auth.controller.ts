import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service.js';
import { registerSchoolSchema, loginSchema } from './auth.validator.js';
import { ApiResponse } from '../../shared/responses/api.response.js';
import { TenantContext } from '../../shared/context/tenant.context.js';

export class AuthController {
  private authService: AuthService;

  constructor(authService?: AuthService) {
    this.authService = authService || new AuthService();
  }

  registerSchool = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedData = registerSchoolSchema.parse(req.body);
      const result = await this.authService.registerSchool(validatedData);
      ApiResponse.created(res, 'School tenant and admin account registered successfully', result);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedData = loginSchema.parse(req.body);
      const tenantId = TenantContext.getTenantId();
      const result = await this.authService.login(validatedData, tenantId);
      ApiResponse.ok(res, 'Login successful', result);
    } catch (error) {
      next(error);
    }
  };
}
