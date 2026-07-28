import { BaseRepository } from '../../shared/repositories/base.repository.js';
import { FeeSettingsModel } from './models/fee-settings.model.js';

export class FeeSettingsRepository extends BaseRepository<FeeSettingsModel> {
  constructor() {
    super(FeeSettingsModel);
  }

  async findByTenant(): Promise<FeeSettingsModel | null> {
    return this.findOne({});
  }
}
