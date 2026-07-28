import { BaseService } from '../../shared/services/base.service.js';
import { FeeCategoryModel } from './models/fee-category.model.js';
import { FeeCategoryRepository } from './fee-category.repository.js';
import { AuditActions } from '../../shared/constants/global.constants.js';

export class FeeCategoryService extends BaseService<FeeCategoryModel, FeeCategoryRepository> {
  constructor(repository?: FeeCategoryRepository) {
    super(repository || new FeeCategoryRepository());
  }

  async getAllCategories(): Promise<FeeCategoryModel[]> {
    this.ensureTenant();
    let categories = await this.repository.findAllCategories();

    // Auto-seed default fee categories if uninitialized
    if (categories.length === 0) {
      categories = await this.repository.bulkCreate([
        { categoryName: 'Tuition Fee', code: 'TUITION', isRecurring: true, isMandatory: true, displayOrder: 1 },
        { categoryName: 'Admission Fee', code: 'ADMISSION', isRecurring: false, isMandatory: true, displayOrder: 2 },
        { categoryName: 'Transport Fee', code: 'TRANSPORT', isRecurring: true, isMandatory: false, displayOrder: 3 },
        { categoryName: 'Laboratory Fee', code: 'LABORATORY', isRecurring: true, isMandatory: false, displayOrder: 4 },
        { categoryName: 'Examination Fee', code: 'EXAM', isRecurring: true, isMandatory: true, displayOrder: 5 },
      ]);
    }
    return categories;
  }

  async createCategory(dto: { categoryName: string; code: string; description?: string; isRecurring?: boolean; isMandatory?: boolean }): Promise<FeeCategoryModel> {
    this.ensureTenant();
    const category = await this.repository.create({
      categoryName: dto.categoryName,
      code: dto.code.toUpperCase(),
      description: dto.description,
      isRecurring: dto.isRecurring ?? true,
      isMandatory: dto.isMandatory ?? true,
      displayOrder: (await this.repository.count()) + 1,
      isActive: true,
    });

    this.publishAudit(AuditActions.FEE_CATEGORY_CREATED, 'FeeCategory', category.id, { categoryName: category.categoryName });
    return category;
  }
}
