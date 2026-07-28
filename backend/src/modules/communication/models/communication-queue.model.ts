import { DataTypes } from 'sequelize';
import { sequelize } from '../../../database/sequelize.js';
import { BaseModel, baseModelAttributes } from '../../../database/base.model.js';

export interface CommunicationQueueAttributes {
  id: string;
  tenantId: string;
  channel: 'SMS' | 'EMAIL' | 'WHATSAPP';
  recipient: string;
  subject?: string;
  body: string;
  attachmentUrl?: string;
  status: 'PENDING' | 'PROCESSING' | 'SENT' | 'DELIVERED' | 'FAILED' | 'RETRYING' | 'CANCELLED';
  priority: number; // 1 = High, 5 = Low
  retryCount: number;
  maxRetries: number;
  failureReason?: string;
  nextAttemptAt?: Date;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class CommunicationQueueModel extends BaseModel<CommunicationQueueAttributes, Partial<CommunicationQueueAttributes>> implements CommunicationQueueAttributes {
  declare channel: 'SMS' | 'EMAIL' | 'WHATSAPP';
  declare recipient: string;
  declare subject?: string;
  declare body: string;
  declare attachmentUrl?: string;
  declare status: 'PENDING' | 'PROCESSING' | 'SENT' | 'DELIVERED' | 'FAILED' | 'RETRYING' | 'CANCELLED';
  declare priority: number;
  declare retryCount: number;
  declare maxRetries: number;
  declare failureReason?: string;
  declare nextAttemptAt?: Date;
}

CommunicationQueueModel.init(
  {
    ...baseModelAttributes,
    channel: { type: DataTypes.ENUM('SMS', 'EMAIL', 'WHATSAPP'), allowNull: false },
    recipient: { type: DataTypes.STRING, allowNull: false },
    subject: { type: DataTypes.STRING, allowNull: true },
    body: { type: DataTypes.TEXT, allowNull: false },
    attachmentUrl: { type: DataTypes.STRING, allowNull: true, field: 'attachment_url' },
    status: { type: DataTypes.ENUM('PENDING', 'PROCESSING', 'SENT', 'DELIVERED', 'FAILED', 'RETRYING', 'CANCELLED'), defaultValue: 'PENDING' },
    priority: { type: DataTypes.INTEGER, defaultValue: 3 },
    retryCount: { type: DataTypes.INTEGER, defaultValue: 0, field: 'retry_count' },
    maxRetries: { type: DataTypes.INTEGER, defaultValue: 3, field: 'max_retries' },
    failureReason: { type: DataTypes.TEXT, allowNull: true, field: 'failure_reason' },
    nextAttemptAt: { type: DataTypes.DATE, allowNull: true, field: 'next_attempt_at' },
  },
  {
    sequelize,
    tableName: 'communication_queues',
    modelName: 'CommunicationQueue',
    indexes: [
      { fields: ['tenant_id'] },
      { fields: ['status'] },
      { fields: ['tenant_id', 'status'] },
    ],
  }
);
