import { Request, Response, NextFunction } from 'express';
import { CommunicationService } from './communication.service.js';
import { ApiResponse } from '../../shared/responses/api.response.js';

export class CommunicationController {
  private service: CommunicationService;

  constructor(service?: CommunicationService) {
    this.service = service || new CommunicationService();
  }

  sendSms = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const item = await this.service.enqueueSms(req.body);
      ApiResponse.created(res, 'SMS message enqueued for dispatch', item);
    } catch (error) {
      next(error);
    }
  };

  sendEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const item = await this.service.enqueueEmail(req.body);
      ApiResponse.created(res, 'Email message enqueued for dispatch', item);
    } catch (error) {
      next(error);
    }
  };

  getTemplates = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const templates = await this.service.getTemplates();
      ApiResponse.ok(res, 'Notification templates retrieved', templates);
    } catch (error) {
      next(error);
    }
  };

  createTemplate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const template = await this.service.createTemplate(req.body);
      ApiResponse.created(res, 'Notification template created successfully', template);
    } catch (error) {
      next(error);
    }
  };

  getDeliveryMetrics = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const metrics = await this.service.getDeliveryMetrics();
      ApiResponse.ok(res, 'Communication delivery metrics retrieved', metrics);
    } catch (error) {
      next(error);
    }
  };
}
