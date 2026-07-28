import { Request, Response, NextFunction } from 'express';
import { PaymentModeService } from './payment-mode.service.js';
import { ApiResponse } from '../../shared/responses/api.response.js';

export class PaymentModeController {
  private service: PaymentModeService;

  constructor(service?: PaymentModeService) {
    this.service = service || new PaymentModeService();
  }

  getAllModes = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const modes = await this.service.getAllModes();
      ApiResponse.ok(res, 'Payment modes retrieved successfully', modes);
    } catch (error) {
      next(error);
    }
  };

  toggleMode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updated = await this.service.toggleMode(req.params.id, req.body.isEnabled);
      ApiResponse.ok(res, 'Payment mode updated successfully', updated);
    } catch (error) {
      next(error);
    }
  };
}
