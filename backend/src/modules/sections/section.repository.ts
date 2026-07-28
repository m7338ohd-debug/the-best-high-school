import { BaseRepository } from '../../shared/repositories/base.repository.js';
import { SectionModel } from './models/section.model.js';

export class SectionRepository extends BaseRepository<SectionModel> {
  constructor() {
    super(SectionModel);
  }

  async findByClass(classId: string): Promise<SectionModel[]> {
    return this.findAll({ where: { classId }, order: [['displayOrder', 'ASC']] });
  }
}
