import { BaseRepository } from '../../shared/repositories/base.repository.js';
import { BrandingModel } from './models/branding.model.js';

export class BrandingRepository extends BaseRepository<BrandingModel> {
  constructor() {
    super(BrandingModel);
  }

  async findByTenant(): Promise<BrandingModel | null> {
    return this.findOne({});
  }
}
