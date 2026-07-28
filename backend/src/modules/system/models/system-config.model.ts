import { DataTypes } from 'sequelize';
import { sequelize } from '../../../database/sequelize.js';
import { BaseModel, baseModelAttributes } from '../../../database/base.model.js';

export interface SystemConfigAttributes {
  id: string;
  tenantId: string;
  schoolName: string;
  receiptPrefix: string;
  currencySymbol: string;
  timezone: string;
  businessHours: string;
  backupSchedule: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class SystemConfigModel extends BaseModel<SystemConfigAttributes, Partial<SystemConfigAttributes>> implements SystemConfigAttributes {
  declare schoolName: string;
  declare receiptPrefix: string;
  declare currencySymbol: string;
  declare timezone: string;
  declare businessHours: string;
  declare backupSchedule: string;
}

SystemConfigModel.init(
  {
    ...baseModelAttributes,
    schoolName: { type: DataTypes.STRING, defaultValue: 'The Best School', field: 'school_name' },
    receiptPrefix: { type: DataTypes.STRING, defaultValue: 'REC-2026-', field: 'receipt_prefix' },
    currencySymbol: { type: DataTypes.STRING, defaultValue: '$', field: 'currency_symbol' },
    timezone: { type: DataTypes.STRING, defaultValue: 'UTC', field: 'timezone' },
    businessHours: { type: DataTypes.STRING, defaultValue: '08:00 AM - 04:00 PM', field: 'business_hours' },
    backupSchedule: { type: DataTypes.STRING, defaultValue: 'Daily at 02:00 AM', field: 'backup_schedule' },
  },
  {
    sequelize,
    tableName: 'system_configs',
    modelName: 'SystemConfig',
    indexes: [{ fields: ['tenant_id'], unique: true }],
  }
);
