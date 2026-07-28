import { Request, Response, NextFunction } from 'express';
import { FinancialSettingsService } from './financial-settings.service.js';
import { ApiResponse } from '../../shared/responses/api.response.js';

export class FinancialSettingsController {
  private service: FinancialSettingsService;

  constructor(service?: FinancialSettingsService) {
    this.service = service || new FinancialSettingsService();
  }

  getSettings = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const settings = await this.service.getSettings();
      ApiResponse.ok(res, 'Financial settings retrieved successfully', settings);
    } catch (error) {
      next(error);
    }
  };

  updateSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updated = await this.service.updateSettings(req.body);
      ApiResponse.ok(res, 'Financial settings updated successfully', updated);
    } catch (error) {
      next(error);
    }
  };
}
