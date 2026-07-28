import { Request, Response, NextFunction } from 'express';
import { FeeSettingsService } from './fee-settings.service.js';
import { ApiResponse } from '../../shared/responses/api.response.js';

export class FeeSettingsController {
  private service: FeeSettingsService;

  constructor(service?: FeeSettingsService) {
    this.service = service || new FeeSettingsService();
  }

  getSettings = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const settings = await this.service.getSettings();
      ApiResponse.ok(res, 'Fee settings retrieved successfully', settings);
    } catch (error) {
      next(error);
    }
  };

  updateSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updated = await this.service.updateSettings(req.body);
      ApiResponse.ok(res, 'Fee settings updated successfully', updated);
    } catch (error) {
      next(error);
    }
  };
}
