import { BaseService } from '../../shared/services/base.service.js';
import { BrandingModel } from './models/branding.model.js';
import { BrandingRepository } from './branding.repository.js';
import { AuditActions } from '../../shared/constants/global.constants.js';

export class BrandingService extends BaseService<BrandingModel, BrandingRepository> {
  constructor(repository?: BrandingRepository) {
    super(repository || new BrandingRepository());
  }

  async getBranding(): Promise<BrandingModel | null> {
    this.ensureTenant();
    return this.repository.findByTenant();
  }

  async updateBranding(dto: Partial<BrandingModel>): Promise<BrandingModel> {
    this.ensureTenant();
    let branding = await this.repository.findByTenant();

    if (!branding) {
      branding = await this.repository.create(dto);
    } else {
      await branding.update(dto);
    }

    this.publishAudit(AuditActions.SETTINGS_UPDATED, 'Branding', branding.id, { action: 'UPDATE_BRANDING' });
    return branding;
  }
}
