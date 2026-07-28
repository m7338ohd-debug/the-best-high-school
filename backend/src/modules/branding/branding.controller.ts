import { Request, Response, NextFunction } from 'express';
import { BrandingService } from './branding.service.js';
import { ApiResponse } from '../../shared/responses/api.response.js';

export class BrandingController {
  private service: BrandingService;

  constructor(service?: BrandingService) {
    this.service = service || new BrandingService();
  }

  getBranding = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const branding = await this.service.getBranding();
      ApiResponse.ok(res, 'Branding settings retrieved successfully', branding);
    } catch (error) {
      next(error);
    }
  };

  updateBranding = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updated = await this.service.updateBranding(req.body);
      ApiResponse.ok(res, 'Branding settings updated successfully', updated);
    } catch (error) {
      next(error);
    }
  };
}
