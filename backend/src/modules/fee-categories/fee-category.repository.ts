import { BaseRepository } from '../../shared/repositories/base.repository.js';
import { FeeCategoryModel } from './models/fee-category.model.js';

export class FeeCategoryRepository extends BaseRepository<FeeCategoryModel> {
  constructor() {
    super(FeeCategoryModel);
  }

  async findAllCategories(): Promise<FeeCategoryModel[]> {
    return this.findAll({ order: [['displayOrder', 'ASC']] });
  }
}
