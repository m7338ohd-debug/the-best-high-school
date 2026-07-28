import { DataTypes } from 'sequelize';
import { sequelize } from '../../../database/sequelize.js';
import { BaseModel, baseModelAttributes } from '../../../database/base.model.js';

export interface FeeStructureAttributes {
  id: string;
  tenantId: string;
  academicYearId: string;
  classId: string;
  feeCategoryId: string;
  amount: number;
  dueDate: string;
  isActive: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class FeeStructureModel extends BaseModel<FeeStructureAttributes, Partial<FeeStructureAttributes>> implements FeeStructureAttributes {
  declare academicYearId: string;
  declare classId: string;
  declare feeCategoryId: string;
  declare amount: number;
  declare dueDate: string;
  declare isActive: boolean;
}

FeeStructureModel.init(
  {
    ...baseModelAttributes,
    academicYearId: { type: DataTypes.UUID, allowNull: false, field: 'academic_year_id' },
    classId: { type: DataTypes.UUID, allowNull: false, field: 'class_id' },
    feeCategoryId: { type: DataTypes.UUID, allowNull: false, field: 'fee_category_id' },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    dueDate: { type: DataTypes.DATEONLY, allowNull: false, field: 'due_date' },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_active' },
  },
  {
    sequelize,
    tableName: 'fee_structures',
    modelName: 'FeeStructure',
    indexes: [{ fields: ['tenant_id'] }, { fields: ['academic_year_id', 'class_id'] }],
  }
);
