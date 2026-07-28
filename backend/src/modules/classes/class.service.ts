import { BaseService } from '../../shared/services/base.service.js';
import { ClassModel } from './models/class.model.js';
import { ClassRepository } from './class.repository.js';
import { CreateClassDTO } from './dto/class.dto.js';
import { createClassSchema } from './validators/class.validator.js';
import { ConflictError } from '../../shared/errors/api.error.js';
import { AuditActions } from '../../shared/constants/global.constants.js';

export class ClassService extends BaseService<ClassModel, ClassRepository> {
  constructor(repository?: ClassRepository) {
    super(repository || new ClassRepository());
  }

  async getAllClasses(): Promise<ClassModel[]> {
    this.ensureTenant();
    return this.repository.findAllClasses();
  }

  async createClass(dto: CreateClassDTO): Promise<ClassModel> {
    this.ensureTenant();
    const validated = this.validate(createClassSchema, dto);

    const existing = await this.repository.findByName(validated.className);
    if (existing) {
      throw new ConflictError(`Class '${validated.className}' already exists for this school`);
    }

    const newClass = await this.repository.create({
      className: validated.className,
      displayName: validated.displayName || validated.className,
      displayOrder: validated.displayOrder || 1,
      description: validated.description,
      isActive: true,
    });

    this.publishAudit(AuditActions.SETTINGS_UPDATED, 'Class', newClass.id, { className: newClass.className });
    return newClass;
  }
}
