import { BaseService } from '../../shared/services/base.service.js';
import { StudentModel } from './models/student.model.js';
import { StudentRepository } from './student.repository.js';
import { StudentAdmissionDTO, BulkPromotionDTO } from './dto/student.dto.js';
import { studentAdmissionSchema } from './validators/student.validator.js';
import { AuditActions } from '../../shared/constants/global.constants.js';
import { StudentEnrolmentModel } from './models/student-enrolment.model.js';

export class StudentService extends BaseService<StudentModel, StudentRepository> {
  constructor(repository?: StudentRepository) {
    super(repository || new StudentRepository());
  }

  async admitStudent(dto: StudentAdmissionDTO) {
    this.ensureTenant();
    const validated = this.validate(studentAdmissionSchema, dto);
    const admissionNo = await this.repository.generateAdmissionNumber();

    const result = await this.repository.transaction(async (t) => {
      return this.repository.createStudentWithParentAndEnrolment(
        {
          admissionNo,
          admissionDate: validated.admissionDate,
          firstName: validated.firstName,
          middleName: validated.middleName,
          lastName: validated.lastName,
          gender: validated.gender,
          dateOfBirth: validated.dateOfBirth,
          bloodGroup: validated.bloodGroup,
          nationality: validated.nationality || 'American',
          religion: validated.religion,
          motherTongue: validated.motherTongue,
          currentAddress: validated.currentAddress,
          permanentAddress: validated.permanentAddress,
          city: validated.city,
          state: validated.state,
          country: validated.country,
          postalCode: validated.postalCode,
          medicalConditions: validated.medicalConditions,
          allergies: validated.allergies,
          status: 'ACTIVE',
        },
        {
          fatherName: validated.fatherName,
          fatherMobile: validated.fatherMobile,
          fatherEmail: validated.fatherEmail,
          motherName: validated.motherName,
          motherMobile: validated.motherMobile,
          emergencyContact: validated.emergencyContact,
          primaryContact: validated.primaryContact || 'FATHER',
          preferredCommunication: 'EMAIL',
        },
        {
          academicYearId: validated.academicYearId,
          classId: validated.classId,
          sectionId: validated.sectionId,
          rollNumber: validated.rollNumber,
          isActive: true,
        },
        t
      );
    });

    this.publishAudit(AuditActions.STUDENT_CREATED, 'Student', result.student.id, {
      admissionNo: result.student.admissionNo,
      studentName: `${result.student.firstName} ${result.student.lastName}`,
    });

    return result;
  }

  async getStudentProfile(id: string) {
    this.ensureTenant();
    return this.repository.findFullStudentProfile(id);
  }

  async bulkPromoteStudents(dto: BulkPromotionDTO): Promise<{ promotedCount: number }> {
    this.ensureTenant();
    let promotedCount = 0;

    await this.repository.transaction(async (t) => {
      for (const studentId of dto.studentIds) {
        // Deactivate old active enrolment
        await StudentEnrolmentModel.update(
          { isActive: false },
          { where: { studentId, academicYearId: dto.fromAcademicYearId }, transaction: t }
        );

        // Create new active enrolment in promoted target class
        await StudentEnrolmentModel.create(
          {
            tenantId: this.ensureTenant(),
            studentId,
            academicYearId: dto.toAcademicYearId,
            classId: dto.toClassId,
            sectionId: dto.toSectionId,
            rollNumber: promotedCount + 1,
            isActive: true,
          },
          { transaction: t }
        );
        promotedCount++;
      }
    });

    this.publishAudit(AuditActions.STUDENT_UPDATED, 'StudentEnrolment', dto.toClassId, { action: 'BULK_PROMOTION', promotedCount });
    return { promotedCount };
  }
}
