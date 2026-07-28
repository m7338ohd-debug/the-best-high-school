import { BaseService } from '../../shared/services/base.service.js';
import { AcademicYearModel } from './models/academic-year.model.js';
import { AcademicYearRepository } from './academic-year.repository.js';
import { CreateAcademicYearDTO } from './dto/academic-year.dto.js';
import { createAcademicYearSchema } from './validators/academic-year.validator.js';
import { AuditActions } from '../../shared/constants/global.constants.js';

export class AcademicYearService extends BaseService<AcademicYearModel, AcademicYearRepository> {
  constructor(repository?: AcademicYearRepository) {
    super(repository || new AcademicYearRepository());
  }

  async getAllYears(): Promise<AcademicYearModel[]> {
    this.ensureTenant();
    return this.repository.findAll({ order: [['startDate', 'DESC']] });
  }

  async getActiveYear(): Promise<AcademicYearModel | null> {
    this.ensureTenant();
    return this.repository.findActiveYear();
  }

  async createYear(dto: CreateAcademicYearDTO): Promise<AcademicYearModel> {
    this.ensureTenant();
    const validated = this.validate(createAcademicYearSchema, dto);
    
    const count = await this.repository.count();
    const makeActive = validated.makeActive || count === 0;

    const newYear = await this.repository.create({
      yearName: validated.yearName,
      startDate: validated.startDate,
      endDate: validated.endDate,
      isActive: false,
    });

    if (makeActive) {
      await this.repository.setActiveYear(newYear.id);
      await newYear.reload();
    }

    this.publishAudit(AuditActions.SETTINGS_UPDATED, 'AcademicYear', newYear.id, { action: 'CREATE_ACADEMIC_YEAR', yearName: newYear.yearName });
    return newYear;
  }

  async activateYear(id: string): Promise<AcademicYearModel> {
    this.ensureTenant();
    const year = await this.getByIdOrThrow(id, 'Academic Year');
    const activated = await this.repository.setActiveYear(year.id);
    this.publishAudit(AuditActions.SETTINGS_UPDATED, 'AcademicYear', year.id, { action: 'ACTIVATE_ACADEMIC_YEAR' });
    return activated!;
  }

  async closeYear(id: string): Promise<AcademicYearModel> {
    this.ensureTenant();
    const year = await this.getByIdOrThrow(id, 'Academic Year');
    await year.update({ isClosed: true, isActive: false });
    this.publishAudit(AuditActions.SETTINGS_UPDATED, 'AcademicYear', year.id, { action: 'CLOSE_ACADEMIC_YEAR' });
    return year;
  }
}
