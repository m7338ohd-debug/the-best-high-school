import { DataTypes } from 'sequelize';
import { sequelize } from '../../../database/sequelize.js';
import { BaseModel, baseModelAttributes } from '../../../database/base.model.js';

export interface StudentParentAttributes {
  id: string;
  tenantId: string;
  studentId: string;
  fatherName?: string;
  fatherMobile?: string;
  fatherEmail?: string;
  fatherOccupation?: string;
  motherName?: string;
  motherMobile?: string;
  motherEmail?: string;
  motherOccupation?: string;
  guardianName?: string;
  guardianRelation?: string;
  guardianMobile?: string;
  guardianEmail?: string;
  primaryContact: 'FATHER' | 'MOTHER' | 'GUARDIAN';
  emergencyContact: string;
  preferredCommunication: 'EMAIL' | 'SMS' | 'WHATSAPP';
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class StudentParentModel extends BaseModel<StudentParentAttributes, Partial<StudentParentAttributes>> implements StudentParentAttributes {
  declare studentId: string;
  declare fatherName?: string;
  declare fatherMobile?: string;
  declare fatherEmail?: string;
  declare fatherOccupation?: string;
  declare motherName?: string;
  declare motherMobile?: string;
  declare motherEmail?: string;
  declare motherOccupation?: string;
  declare guardianName?: string;
  declare guardianRelation?: string;
  declare guardianMobile?: string;
  declare guardianEmail?: string;
  declare primaryContact: 'FATHER' | 'MOTHER' | 'GUARDIAN';
  declare emergencyContact: string;
  declare preferredCommunication: 'EMAIL' | 'SMS' | 'WHATSAPP';
}

StudentParentModel.init(
  {
    ...baseModelAttributes,
    studentId: { type: DataTypes.UUID, allowNull: false, field: 'student_id' },
    fatherName: { type: DataTypes.STRING, allowNull: true, field: 'father_name' },
    fatherMobile: { type: DataTypes.STRING, allowNull: true, field: 'father_mobile' },
    fatherEmail: { type: DataTypes.STRING, allowNull: true, field: 'father_email' },
    fatherOccupation: { type: DataTypes.STRING, allowNull: true, field: 'father_occupation' },
    motherName: { type: DataTypes.STRING, allowNull: true, field: 'mother_name' },
    motherMobile: { type: DataTypes.STRING, allowNull: true, field: 'mother_mobile' },
    motherEmail: { type: DataTypes.STRING, allowNull: true, field: 'mother_email' },
    motherOccupation: { type: DataTypes.STRING, allowNull: true, field: 'mother_occupation' },
    guardianName: { type: DataTypes.STRING, allowNull: true, field: 'guardian_name' },
    guardianRelation: { type: DataTypes.STRING, allowNull: true, field: 'guardian_relation' },
    guardianMobile: { type: DataTypes.STRING, allowNull: true, field: 'guardian_mobile' },
    guardianEmail: { type: DataTypes.STRING, allowNull: true, field: 'guardian_email' },
    primaryContact: { type: DataTypes.ENUM('FATHER', 'MOTHER', 'GUARDIAN'), defaultValue: 'FATHER', field: 'primary_contact' },
    emergencyContact: { type: DataTypes.STRING, allowNull: false, field: 'emergency_contact' },
    preferredCommunication: { type: DataTypes.ENUM('EMAIL', 'SMS', 'WHATSAPP'), defaultValue: 'EMAIL', field: 'preferred_communication' },
  },
  {
    sequelize,
    tableName: 'student_parents',
    modelName: 'StudentParent',
    indexes: [{ fields: ['tenant_id'] }, { fields: ['student_id'] }],
  }
);
