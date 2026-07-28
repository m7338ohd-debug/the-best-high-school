import { BaseService } from '../../shared/services/base.service.js';
import { SectionModel } from './models/section.model.js';
import { SectionRepository } from './section.repository.js';
import { AuditActions } from '../../shared/constants/global.constants.js';

export class SectionService extends BaseService<SectionModel, SectionRepository> {
  constructor(repository?: SectionRepository) {
    super(repository || new SectionRepository());
  }

  async getSectionsByClass(classId: string): Promise<SectionModel[]> {
    this.ensureTenant();
    return this.repository.findByClass(classId);
  }

  async createSection(dto: { classId: string; sectionName: string; capacity?: number; roomNumber?: string }): Promise<SectionModel> {
    this.ensureTenant();
    const section = await this.repository.create({
      classId: dto.classId,
      sectionName: dto.sectionName,
      capacity: dto.capacity || 40,
      roomNumber: dto.roomNumber,
      isActive: true,
    });

    this.publishAudit(AuditActions.SETTINGS_UPDATED, 'Section', section.id, { sectionName: section.sectionName, classId: dto.classId });
    return section;
  }
}
