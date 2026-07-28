import { DataTypes } from 'sequelize';
import { sequelize } from '../../../database/sequelize.js';
import { BaseModel, baseModelAttributes } from '../../../database/base.model.js';

export interface StudentAttributes {
  id: string;
  tenantId: string;
  admissionNo: string; // e.g. "ADM-2026-0001"
  admissionDate: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth: string;
  bloodGroup?: string;
  nationality?: string;
  religion?: string;
  motherTongue?: string;
  aadhaarNo?: string;
  birthCertificateNo?: string;
  passportNo?: string;
  currentAddress?: string;
  permanentAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  medicalConditions?: string;
  allergies?: string;
  emergencyNotes?: string;
  doctorName?: string;
  doctorContact?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'GRADUATED' | 'TRANSFERRED' | 'SUSPENDED' | 'DROPPED';
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class StudentModel extends BaseModel<StudentAttributes, Partial<StudentAttributes>> implements StudentAttributes {
  declare admissionNo: string;
  declare admissionDate: string;
  declare firstName: string;
  declare middleName?: string;
  declare lastName: string;
  declare gender: 'MALE' | 'FEMALE' | 'OTHER';
  declare dateOfBirth: string;
  declare bloodGroup?: string;
  declare nationality?: string;
  declare religion?: string;
  declare motherTongue?: string;
  declare aadhaarNo?: string;
  declare birthCertificateNo?: string;
  declare passportNo?: string;
  declare currentAddress?: string;
  declare permanentAddress?: string;
  declare city?: string;
  declare state?: string;
  declare country?: string;
  declare postalCode?: string;
  declare medicalConditions?: string;
  declare allergies?: string;
  declare emergencyNotes?: string;
  declare doctorName?: string;
  declare doctorContact?: string;
  declare status: 'ACTIVE' | 'INACTIVE' | 'GRADUATED' | 'TRANSFERRED' | 'SUSPENDED' | 'DROPPED';
}

StudentModel.init(
  {
    ...baseModelAttributes,
    admissionNo: { type: DataTypes.STRING, allowNull: false, field: 'admission_no' },
    admissionDate: { type: DataTypes.DATEONLY, allowNull: false, field: 'admission_date' },
    firstName: { type: DataTypes.STRING, allowNull: false, field: 'first_name' },
    middleName: { type: DataTypes.STRING, allowNull: true, field: 'middle_name' },
    lastName: { type: DataTypes.STRING, allowNull: false, field: 'last_name' },
    gender: { type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHER'), allowNull: false },
    dateOfBirth: { type: DataTypes.DATEONLY, allowNull: false, field: 'date_of_birth' },
    bloodGroup: { type: DataTypes.STRING, allowNull: true, field: 'blood_group' },
    nationality: { type: DataTypes.STRING, defaultValue: 'American' },
    religion: { type: DataTypes.STRING, allowNull: true },
    motherTongue: { type: DataTypes.STRING, allowNull: true, field: 'mother_tongue' },
    aadhaarNo: { type: DataTypes.STRING, allowNull: true, field: 'aadhaar_no' },
    birthCertificateNo: { type: DataTypes.STRING, allowNull: true, field: 'birth_certificate_no' },
    passportNo: { type: DataTypes.STRING, allowNull: true, field: 'passport_no' },
    currentAddress: { type: DataTypes.TEXT, allowNull: true, field: 'current_address' },
    permanentAddress: { type: DataTypes.TEXT, allowNull: true, field: 'permanent_address' },
    city: { type: DataTypes.STRING, allowNull: true },
    state: { type: DataTypes.STRING, allowNull: true },
    country: { type: DataTypes.STRING, allowNull: true },
    postalCode: { type: DataTypes.STRING, allowNull: true, field: 'postal_code' },
    medicalConditions: { type: DataTypes.TEXT, allowNull: true, field: 'medical_conditions' },
    allergies: { type: DataTypes.TEXT, allowNull: true },
    emergencyNotes: { type: DataTypes.TEXT, allowNull: true, field: 'emergency_notes' },
    doctorName: { type: DataTypes.STRING, allowNull: true, field: 'doctor_name' },
    doctorContact: { type: DataTypes.STRING, allowNull: true, field: 'doctor_contact' },
    status: { type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'GRADUATED', 'TRANSFERRED', 'SUSPENDED', 'DROPPED'), defaultValue: 'ACTIVE' },
  },
  {
    sequelize,
    tableName: 'students',
    modelName: 'Student',
    indexes: [
      { fields: ['tenant_id'] },
      { fields: ['tenant_id', 'admission_no'], unique: true },
      { fields: ['tenant_id', 'status'] },
    ],
  }
);
