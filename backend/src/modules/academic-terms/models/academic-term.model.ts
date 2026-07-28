import { DataTypes } from 'sequelize';
import { sequelize } from '../../../database/sequelize.js';
import { BaseModel, baseModelAttributes } from '../../../database/base.model.js';

export interface AcademicTermAttributes {
  id: string;
  tenantId: string;
  termName: string; // e.g. "Term 1", "Semester 1"
  startDate: string;
  endDate: string;
  isCurrentTerm: boolean;
  displayOrder: number;
  isActive: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class AcademicTermModel extends BaseModel<AcademicTermAttributes, Partial<AcademicTermAttributes>> implements AcademicTermAttributes {
  declare termName: string;
  declare startDate: string;
  declare endDate: string;
  declare isCurrentTerm: boolean;
  declare displayOrder: number;
  declare isActive: boolean;
}

AcademicTermModel.init(
  {
    ...baseModelAttributes,
    termName: { type: DataTypes.STRING, allowNull: false, field: 'term_name' },
    startDate: { type: DataTypes.DATEONLY, allowNull: false, field: 'start_date' },
    endDate: { type: DataTypes.DATEONLY, allowNull: false, field: 'end_date' },
    isCurrentTerm: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_current_term' },
    displayOrder: { type: DataTypes.INTEGER, defaultValue: 1, field: 'display_order' },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_active' },
  },
  {
    sequelize,
    tableName: 'academic_terms',
    modelName: 'AcademicTerm',
    indexes: [{ fields: ['tenant_id'] }],
  }
);
