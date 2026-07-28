import { Request, Response, NextFunction } from 'express';
import { SystemService } from './system.service.js';
import { ApiResponse } from '../../shared/responses/api.response.js';

export class SystemController {
  private service: SystemService;

  constructor(service?: SystemService) {
    this.service = service || new SystemService();
  }

  getConfig = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const config = await this.service.getConfig();
      ApiResponse.ok(res, 'System configuration retrieved successfully', config);
    } catch (error) {
      next(error);
    }
  };

  updateConfig = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const config = await this.service.updateConfig(req.body);
      ApiResponse.ok(res, 'System configuration updated successfully', config);
    } catch (error) {
      next(error);
    }
  };

  getSubscription = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sub = await this.service.getSubscription();
      ApiResponse.ok(res, 'SaaS subscription details retrieved', sub);
    } catch (error) {
      next(error);
    }
  };

  triggerBackup = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const backup = await this.service.triggerManualBackup();
      ApiResponse.created(res, 'Manual database backup completed successfully', backup);
    } catch (error) {
      next(error);
    }
  };

  restoreBackup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.restoreBackup(req.body);
      ApiResponse.ok(res, 'Disaster recovery restore executed and verified', result);
    } catch (error) {
      next(error);
    }
  };

  getHealth = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const health = await this.service.getHealthOverview();
      ApiResponse.ok(res, 'System deployment health overview retrieved', health);
    } catch (error) {
      next(error);
    }
  };

  getBackups = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const history = await this.service.getBackupHistory();
      ApiResponse.ok(res, 'Backup history logs retrieved', history);
    } catch (error) {
      next(error);
    }
  };

  sendInvitation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.sendSchoolInvitation(req.body);
      ApiResponse.ok(res, 'School invitation email dispatched successfully via Gmail SMTP', result);
    } catch (error) {
      next(error);
    }
  };

  getTenants = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenants = await this.service.getAllTenants();
      ApiResponse.ok(res, 'All PostgreSQL school tenants retrieved', tenants);
    } catch (error) {
      next(error);
    }
  };

  toggleTenant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenant = await this.service.toggleTenantStatus(req.params.id);
      ApiResponse.ok(res, 'Tenant status toggled successfully', tenant);
    } catch (error) {
      next(error);
    }
  };
}
