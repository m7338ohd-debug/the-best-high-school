import { DataTypes } from 'sequelize';
import { sequelize } from '../../../database/sequelize.js';
import { BaseModel, baseModelAttributes } from '../../../database/base.model.js';

export interface FeeCategoryAttributes {
  id: string;
  tenantId: string;
  categoryName: string;
  code: string;
  description?: string;
  isRecurring: boolean;
  isMandatory: boolean;
  displayOrder: number;
  isActive: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class FeeCategoryModel extends BaseModel<FeeCategoryAttributes, Partial<FeeCategoryAttributes>> implements FeeCategoryAttributes {
  declare categoryName: string;
  declare code: string;
  declare description?: string;
  declare isRecurring: boolean;
  declare isMandatory: boolean;
  declare displayOrder: number;
  declare isActive: boolean;
}

FeeCategoryModel.init(
  {
    ...baseModelAttributes,
    categoryName: { type: DataTypes.STRING, allowNull: false, field: 'category_name' },
    code: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    isRecurring: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_recurring' },
    isMandatory: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_mandatory' },
    displayOrder: { type: DataTypes.INTEGER, defaultValue: 1, field: 'display_order' },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_active' },
  },
  {
    sequelize,
    tableName: 'fee_categories',
    modelName: 'FeeCategory',
    indexes: [{ fields: ['tenant_id'] }, { fields: ['code'] }],
  }
);
