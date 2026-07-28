import { DataTypes } from 'sequelize';
import { sequelize } from '../../../database/sequelize.js';
import { BaseModel, baseModelAttributes } from '../../../database/base.model.js';

export interface StudentDocumentAttributes {
  id: string;
  tenantId: string;
  studentId: string;
  documentTypeId?: string;
  documentName: string;
  fileUrl: string;
  publicId?: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class StudentDocumentModel extends BaseModel<StudentDocumentAttributes, Partial<StudentDocumentAttributes>> implements StudentDocumentAttributes {
  declare studentId: string;
  declare documentTypeId?: string;
  declare documentName: string;
  declare fileUrl: string;
  declare publicId?: string;
}

StudentDocumentModel.init(
  {
    ...baseModelAttributes,
    studentId: { type: DataTypes.UUID, allowNull: false, field: 'student_id' },
    documentTypeId: { type: DataTypes.UUID, allowNull: true, field: 'document_type_id' },
    documentName: { type: DataTypes.STRING, allowNull: false, field: 'document_name' },
    fileUrl: { type: DataTypes.STRING, allowNull: false, field: 'file_url' },
    publicId: { type: DataTypes.STRING, allowNull: true, field: 'public_id' },
  },
  {
    sequelize,
    tableName: 'student_documents',
    modelName: 'StudentDocument',
    indexes: [{ fields: ['tenant_id'] }, { fields: ['student_id'] }],
  }
);
