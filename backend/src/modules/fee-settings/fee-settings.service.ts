import { BaseService } from '../../shared/services/base.service.js';
import { FeeSettingsModel } from './models/fee-settings.model.js';
import { FeeSettingsRepository } from './fee-settings.repository.js';
import { AuditActions } from '../../shared/constants/global.constants.js';
import { RuleEngineService } from '../../shared/rules/rule-engine.service.js';

export class FeeSettingsService extends BaseService<FeeSettingsModel, FeeSettingsRepository> {
  constructor(repository?: FeeSettingsRepository) {
    super(repository || new FeeSettingsRepository());
  }

  async getSettings(): Promise<FeeSettingsModel | null> {
    this.ensureTenant();
    return this.repository.findByTenant();
  }

  async updateSettings(dto: Partial<FeeSettingsModel>): Promise<FeeSettingsModel> {
    this.ensureTenant();
    let settings = await this.repository.findByTenant();

    if (!settings) {
      settings = await this.repository.create(dto);
    } else {
      await settings.update(dto);
    }

    this.publishAudit(AuditActions.SETTINGS_UPDATED, 'FeeSettings', settings.id, { action: 'UPDATE_FEE_SETTINGS' });
    return settings;
  }

  async calculateLateFee(dueDate: Date, originalAmount: number): Promise<number> {
    const settings = await this.getSettings();
    if (!settings || !settings.lateFeeEnabled) return 0;

    const fine = RuleEngineService.calculateLateFee(dueDate, originalAmount, {
      enabled: settings.lateFeeEnabled,
      gracePeriodDays: settings.gracePeriodDays,
      feeType: settings.lateFeeType,
      amount: settings.lateFeeAmount,
    });

    return Math.min(fine, settings.maximumFine);
  }
}
