import { DataTypes } from 'sequelize';
import { sequelize } from '../../../database/sequelize.js';
import { BaseModel, baseModelAttributes } from '../../../database/base.model.js';

export interface ClassAttributes {
  id: string;
  tenantId: string;
  className: string; // e.g. "Class 10", "LKG"
  displayName?: string;
  displayOrder: number;
  description?: string;
  isActive: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class ClassModel extends BaseModel<ClassAttributes, Partial<ClassAttributes>> implements ClassAttributes {
  declare className: string;
  declare displayName?: string;
  declare displayOrder: number;
  declare description?: string;
  declare isActive: boolean;
}

ClassModel.init(
  {
    ...baseModelAttributes,
    className: { type: DataTypes.STRING, allowNull: false, field: 'class_name' },
    displayName: { type: DataTypes.STRING, allowNull: true, field: 'display_name' },
    displayOrder: { type: DataTypes.INTEGER, defaultValue: 1, field: 'display_order' },
    description: { type: DataTypes.TEXT, allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_active' },
  },
  {
    sequelize,
    tableName: 'classes',
    modelName: 'Class',
    indexes: [
      { fields: ['tenant_id'] },
      { fields: ['tenant_id', 'class_name'], unique: true },
    ],
  }
);
