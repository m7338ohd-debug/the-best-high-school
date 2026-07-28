import { BaseRepository } from '../../shared/repositories/base.repository.js';
import { SchoolProfileModel } from './models/school-profile.model.js';

export class SchoolProfileRepository extends BaseRepository<SchoolProfileModel> {
  constructor() {
    super(SchoolProfileModel);
  }

  async findByTenant(): Promise<SchoolProfileModel | null> {
    return this.findOne({});
  }
}
