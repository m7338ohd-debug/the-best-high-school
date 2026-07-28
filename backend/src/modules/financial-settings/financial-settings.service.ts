import { BaseService } from '../../shared/services/base.service.js';
import { FinancialSettingsModel } from './models/financial-settings.model.js';
import { FinancialSettingsRepository } from './financial-settings.repository.js';
import { AuditActions } from '../../shared/constants/global.constants.js';
import { RuleEngineService } from '../../shared/rules/rule-engine.service.js';

export class FinancialSettingsService extends BaseService<FinancialSettingsModel, FinancialSettingsRepository> {
  constructor(repository?: FinancialSettingsRepository) {
    super(repository || new FinancialSettingsRepository());
  }

  async getSettings(): Promise<FinancialSettingsModel | null> {
    this.ensureTenant();
    return this.repository.findByTenant();
  }

  async updateSettings(dto: Partial<FinancialSettingsModel>): Promise<FinancialSettingsModel> {
    this.ensureTenant();
    let settings = await this.repository.findByTenant();

    if (!settings) {
      settings = await this.repository.create(dto);
    } else {
      await settings.update(dto);
    }

    this.publishAudit(AuditActions.SETTINGS_UPDATED, 'FinancialSettings', settings.id, { action: 'UPDATE_FINANCIAL_SETTINGS' });
    return settings;
  }

  async formatReceiptNumber(sequence: number): Promise<string> {
    const settings = await this.getSettings();
    const prefix = settings?.receiptPrefix || 'REC';
    const year = settings?.financialYear?.substring(0, 4) || '2026';
    return RuleEngineService.generateReceiptNumber(prefix, sequence, year);
  }
}
