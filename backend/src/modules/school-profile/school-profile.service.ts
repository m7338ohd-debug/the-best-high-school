import { BaseService } from '../../shared/services/base.service.js';
import { SchoolProfileModel } from './models/school-profile.model.js';
import { SchoolProfileRepository } from './school-profile.repository.js';
import { UpdateSchoolProfileDTO } from './dto/school-profile.dto.js';
import { updateSchoolProfileSchema } from './validators/school-profile.validator.js';
import { AuditActions } from '../../shared/constants/global.constants.js';

export class SchoolProfileService extends BaseService<SchoolProfileModel, SchoolProfileRepository> {
  constructor(repository?: SchoolProfileRepository) {
    super(repository || new SchoolProfileRepository());
  }

  async getProfile(): Promise<SchoolProfileModel | null> {
    this.ensureTenant();
    return this.repository.findByTenant();
  }

  async updateProfile(dto: UpdateSchoolProfileDTO): Promise<SchoolProfileModel> {
    this.ensureTenant();
    const validated = this.validate(updateSchoolProfileSchema, dto);
    let profile = await this.repository.findByTenant();

    if (!profile) {
      profile = await this.repository.create({
        schoolName: validated.schoolName || 'The Best School',
        schoolCode: 'TBS-001',
        email: validated.email || 'contact@bestschool.edu',
        schoolStatus: 'ACTIVE',
        subscriptionStatus: 'ACTIVE',
        ...validated,
      });
    } else {
      await profile.update(validated);
    }

    this.publishAudit(AuditActions.SCHOOL_UPDATED, 'SchoolProfile', profile.id, { updatedFields: Object.keys(validated) });
    return profile;
  }
}
