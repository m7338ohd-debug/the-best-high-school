import { BaseRepository } from '../../shared/repositories/base.repository.js';
import { FinancialSettingsModel } from './models/financial-settings.model.js';

export class FinancialSettingsRepository extends BaseRepository<FinancialSettingsModel> {
  constructor() {
    super(FinancialSettingsModel);
  }

  async findByTenant(): Promise<FinancialSettingsModel | null> {
    return this.findOne({});
  }
}
