import { BaseRepository } from '../../shared/repositories/base.repository.js';
import { AcademicYearModel } from './models/academic-year.model.js';
import { Transaction } from 'sequelize';

export class AcademicYearRepository extends BaseRepository<AcademicYearModel> {
  constructor() {
    super(AcademicYearModel);
  }

  async findActiveYear(): Promise<AcademicYearModel | null> {
    return this.findOne({ where: { isActive: true } });
  }

  async deactivateAllYears(transaction?: Transaction): Promise<void> {
    await this.bulkUpdate({}, { isActive: false }, transaction);
  }

  async setActiveYear(id: string): Promise<AcademicYearModel | null> {
    return this.transaction(async (t) => {
      await this.deactivateAllYears(t);
      const year = await this.findById(id, { transaction: t });
      if (year) {
        await year.update({ isActive: true }, { transaction: t });
      }
      return year;
    });
  }
}
