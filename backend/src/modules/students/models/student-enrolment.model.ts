import { DataTypes } from 'sequelize';
import { sequelize } from '../../../database/sequelize.js';
import { BaseModel, baseModelAttributes } from '../../../database/base.model.js';

export interface StudentEnrolmentAttributes {
  id: string;
  tenantId: string;
  studentId: string;
  academicYearId: string;
  classId: string;
  sectionId: string;
  rollNumber: number;
  isActive: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class StudentEnrolmentModel extends BaseModel<StudentEnrolmentAttributes, Partial<StudentEnrolmentAttributes>> implements StudentEnrolmentAttributes {
  declare studentId: string;
  declare academicYearId: string;
  declare classId: string;
  declare sectionId: string;
  declare rollNumber: number;
  declare isActive: boolean;
}

StudentEnrolmentModel.init(
  {
    ...baseModelAttributes,
    studentId: { type: DataTypes.UUID, allowNull: false, field: 'student_id' },
    academicYearId: { type: DataTypes.UUID, allowNull: false, field: 'academic_year_id' },
    classId: { type: DataTypes.UUID, allowNull: false, field: 'class_id' },
    sectionId: { type: DataTypes.UUID, allowNull: false, field: 'section_id' },
    rollNumber: { type: DataTypes.INTEGER, allowNull: false, field: 'roll_number' },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_active' },
  },
  {
    sequelize,
    tableName: 'student_enrolments',
    modelName: 'StudentEnrolment',
    indexes: [
      { fields: ['tenant_id'] },
      { fields: ['student_id'] },
      { name: 'idx_enrol_unique', fields: ['tenant_id', 'academic_year_id', 'class_id', 'section_id', 'roll_number'], unique: true },
    ],
  }
);
