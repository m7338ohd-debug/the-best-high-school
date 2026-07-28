import { BaseRepository } from '../../shared/repositories/base.repository.js';
import { AcademicTermModel } from './models/academic-term.model.js';
import { Transaction } from 'sequelize';

export class AcademicTermRepository extends BaseRepository<AcademicTermModel> {
  constructor() {
    super(AcademicTermModel);
  }

  async findCurrentTerm(): Promise<AcademicTermModel | null> {
    return this.findOne({ where: { isCurrentTerm: true } });
  }

  async setCurrentTerm(id: string): Promise<AcademicTermModel | null> {
    return this.transaction(async (t: Transaction) => {
      await this.bulkUpdate({}, { isCurrentTerm: false }, t);
      const term = await this.findById(id, { transaction: t });
      if (term) {
        await term.update({ isCurrentTerm: true }, { transaction: t });
      }
      return term;
    });
  }
}
