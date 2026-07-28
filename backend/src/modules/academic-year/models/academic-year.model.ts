import { DataTypes } from 'sequelize';
import { sequelize } from '../../../database/sequelize.js';
import { BaseModel, baseModelAttributes } from '../../../database/base.model.js';

export interface AcademicYearAttributes {
  id: string;
  tenantId: string;
  yearName: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isArchived: boolean;
  isClosed: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class AcademicYearModel extends BaseModel<AcademicYearAttributes, Partial<AcademicYearAttributes>> implements AcademicYearAttributes {
  declare yearName: string;
  declare startDate: string;
  declare endDate: string;
  declare isActive: boolean;
  declare isArchived: boolean;
  declare isClosed: boolean;
}

AcademicYearModel.init(
  {
    ...baseModelAttributes,
    yearName: { type: DataTypes.STRING, allowNull: false, field: 'year_name' },
    startDate: { type: DataTypes.DATEONLY, allowNull: false, field: 'start_date' },
    endDate: { type: DataTypes.DATEONLY, allowNull: false, field: 'end_date' },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_active' },
    isArchived: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_archived' },
    isClosed: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_closed' },
  },
  {
    sequelize,
    tableName: 'academic_years',
    modelName: 'AcademicYear',
    indexes: [{ fields: ['tenant_id'] }, { fields: ['year_name'] }],
  }
);
