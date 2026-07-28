import { BaseService } from '../../shared/services/base.service.js';
import { AcademicTermModel } from './models/academic-term.model.js';
import { AcademicTermRepository } from './academic-term.repository.js';
import { AuditActions } from '../../shared/constants/global.constants.js';

export class AcademicTermService extends BaseService<AcademicTermModel, AcademicTermRepository> {
  constructor(repository?: AcademicTermRepository) {
    super(repository || new AcademicTermRepository());
  }

  async getAllTerms(): Promise<AcademicTermModel[]> {
    this.ensureTenant();
    return this.repository.findAll({ order: [['displayOrder', 'ASC']] });
  }

  async createTerm(dto: { termName: string; startDate: string; endDate: string; displayOrder?: number }): Promise<AcademicTermModel> {
    this.ensureTenant();
    const count = await this.repository.count();
    const term = await this.repository.create({
      termName: dto.termName,
      startDate: dto.startDate,
      endDate: dto.endDate,
      isCurrentTerm: count === 0,
      displayOrder: dto.displayOrder || count + 1,
      isActive: true,
    });

    this.publishAudit(AuditActions.SETTINGS_UPDATED, 'AcademicTerm', term.id, { termName: term.termName });
    return term;
  }

  async setCurrentTerm(id: string): Promise<AcademicTermModel> {
    this.ensureTenant();
    const term = await this.getByIdOrThrow(id, 'Academic Term');
    const updated = await this.repository.setCurrentTerm(term.id);
    this.publishAudit(AuditActions.SETTINGS_UPDATED, 'AcademicTerm', term.id, { action: 'SET_CURRENT_TERM' });
    return updated!;
  }
}
