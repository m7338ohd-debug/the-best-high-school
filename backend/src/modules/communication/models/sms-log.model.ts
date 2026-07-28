import { DataTypes } from 'sequelize';
import { sequelize } from '../../../database/sequelize.js';
import { BaseModel, baseModelAttributes } from '../../../database/base.model.js';

export interface SmsLogAttributes {
  id: string;
  tenantId: string;
  recipientPhone: string;
  messageText: string;
  providerName: string;
  status: 'SENT' | 'FAILED' | 'PENDING';
  failureReason?: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class SmsLogModel extends BaseModel<SmsLogAttributes, Partial<SmsLogAttributes>> implements SmsLogAttributes {
  declare recipientPhone: string;
  declare messageText: string;
  declare providerName: string;
  declare status: 'SENT' | 'FAILED' | 'PENDING';
  declare failureReason?: string;
}

SmsLogModel.init(
  {
    ...baseModelAttributes,
    recipientPhone: { type: DataTypes.STRING, allowNull: false, field: 'recipient_phone' },
    messageText: { type: DataTypes.TEXT, allowNull: false, field: 'message_text' },
    providerName: { type: DataTypes.STRING, defaultValue: 'Fast2SMS', field: 'provider_name' },
    status: { type: DataTypes.ENUM('SENT', 'FAILED', 'PENDING'), defaultValue: 'SENT' },
    failureReason: { type: DataTypes.TEXT, allowNull: true, field: 'failure_reason' },
  },
  {
    sequelize,
    tableName: 'sms_logs',
    modelName: 'SmsLog',
    indexes: [{ fields: ['tenant_id'] }, { fields: ['recipient_phone'] }],
  }
);
