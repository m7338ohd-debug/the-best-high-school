import { DataTypes } from 'sequelize';
import { sequelize } from '../../../database/sequelize.js';
import { BaseModel, baseModelAttributes } from '../../../database/base.model.js';

export interface PaymentModeAttributes {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  description?: string;
  isEnabled: boolean;
  displayOrder: number;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class PaymentModeModel extends BaseModel<PaymentModeAttributes, Partial<PaymentModeAttributes>> implements PaymentModeAttributes {
  declare code: string;
  declare name: string;
  declare description?: string;
  declare isEnabled: boolean;
  declare displayOrder: number;
}

PaymentModeModel.init(
  {
    ...baseModelAttributes,
    code: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
    isEnabled: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_enabled' },
    displayOrder: { type: DataTypes.INTEGER, defaultValue: 1, field: 'display_order' },
  },
  {
    sequelize,
    tableName: 'payment_modes',
    modelName: 'PaymentMode',
    indexes: [{ fields: ['tenant_id'] }, { fields: ['code'] }],
  }
);
