import { DataTypes } from 'sequelize';
import { sequelize } from '../../../database/sequelize.js';
import { BaseModel, baseModelAttributes } from '../../../database/base.model.js';

export interface SubscriptionAttributes {
  id: string;
  tenantId: string;
  planName: 'TRIAL' | 'PRO' | 'ENTERPRISE';
  maxStudents: number;
  expiryDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED';
  licenseKey: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class SubscriptionModel extends BaseModel<SubscriptionAttributes, Partial<SubscriptionAttributes>> implements SubscriptionAttributes {
  declare planName: 'TRIAL' | 'PRO' | 'ENTERPRISE';
  declare maxStudents: number;
  declare expiryDate: string;
  declare status: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED';
  declare licenseKey: string;
}

SubscriptionModel.init(
  {
    ...baseModelAttributes,
    planName: { type: DataTypes.ENUM('TRIAL', 'PRO', 'ENTERPRISE'), defaultValue: 'ENTERPRISE', field: 'plan_name' },
    maxStudents: { type: DataTypes.INTEGER, defaultValue: 2500, field: 'max_students' },
    expiryDate: { type: DataTypes.STRING, defaultValue: '2027-12-31', field: 'expiry_date' },
    status: { type: DataTypes.ENUM('ACTIVE', 'EXPIRED', 'SUSPENDED'), defaultValue: 'ACTIVE' },
    licenseKey: { type: DataTypes.STRING, defaultValue: 'LIC-BESTSCHOOL-2026-ENTERPRISE', field: 'license_key' },
  },
  {
    sequelize,
    tableName: 'subscriptions',
    modelName: 'Subscription',
    indexes: [{ fields: ['tenant_id'], unique: true }],
  }
);
