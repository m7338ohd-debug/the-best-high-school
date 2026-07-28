import { BaseRepository } from '../../shared/repositories/base.repository.js';
import { ClassModel } from './models/class.model.js';

export class ClassRepository extends BaseRepository<ClassModel> {
  constructor() {
    super(ClassModel);
  }

  async findByName(className: string): Promise<ClassModel | null> {
    return this.findOneBy({ className });
  }

  async findAllClasses(): Promise<ClassModel[]> {
    return this.findAll({ order: [['displayOrder', 'ASC']] });
  }
}
