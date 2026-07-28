import { BaseRepository } from '../../shared/repositories/base.repository.js';
import { StudentModel } from './models/student.model.js';
import { StudentParentModel } from './models/student-parent.model.js';
import { StudentEnrolmentModel } from './models/student-enrolment.model.js';
import { StudentDocumentModel } from './models/student-document.model.js';
import { TenantContext } from '../../shared/context/tenant.context.js';
import { Transaction } from 'sequelize';

export class StudentRepository extends BaseRepository<StudentModel> {
  constructor() {
    super(StudentModel);
  }

  /**
   * Auto-generates sequential admission number (e.g. ADM-2026-0001)
   */
  async generateAdmissionNumber(year = '2026'): Promise<string> {
    const tenantId = TenantContext.getTenantId();
    const count = await this.count({ tenantId });
    const sequence = String(count + 1).padStart(4, '0');
    return `ADM-${year}-${sequence}`;
  }

  async findFullStudentProfile(studentId: string) {
    const student = await this.findById(studentId);
    if (!student) return null;

    const parent = await StudentParentModel.findOne({ where: this.withTenant({ studentId }) });
    const enrolments = await StudentEnrolmentModel.findAll({ where: this.withTenant({ studentId }) });
    const documents = await StudentDocumentModel.findAll({ where: this.withTenant({ studentId }) });

    return {
      student,
      parent,
      enrolments,
      documents,
    };
  }

  async createStudentWithParentAndEnrolment(
    studentData: Partial<StudentModel>,
    parentData: Partial<StudentParentModel>,
    enrolmentData: Partial<StudentEnrolmentModel>,
    transaction?: Transaction
  ) {
    const student = await this.create(studentData, transaction);
    const tenantId = TenantContext.getTenantId();

    const parent = await StudentParentModel.create(
      { ...(parentData as object), studentId: student.id, tenantId } as StudentParentModel['_creationAttributes'],
      { transaction }
    );

    const enrolment = await StudentEnrolmentModel.create(
      { ...(enrolmentData as object), studentId: student.id, tenantId, isActive: true } as StudentEnrolmentModel['_creationAttributes'],
      { transaction }
    );

    return { student, parent, enrolment };
  }
}
