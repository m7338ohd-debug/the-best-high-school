import { DataTypes } from 'sequelize';
import { sequelize } from '../../../database/sequelize.js';
import { BaseModel, baseModelAttributes } from '../../../database/base.model.js';

export interface EmailLogAttributes {
  id: string;
  tenantId: string;
  recipientEmail: string;
  subject: string;
  bodyHtml: string;
  attachmentUrl?: string;
  providerName: string;
  status: 'SENT' | 'FAILED' | 'PENDING';
  failureReason?: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class EmailLogModel extends BaseModel<EmailLogAttributes, Partial<EmailLogAttributes>> implements EmailLogAttributes {
  declare recipientEmail: string;
  declare subject: string;
  declare bodyHtml: string;
  declare attachmentUrl?: string;
  declare providerName: string;
  declare status: 'SENT' | 'FAILED' | 'PENDING';
  declare failureReason?: string;
}

EmailLogModel.init(
  {
    ...baseModelAttributes,
    recipientEmail: { type: DataTypes.STRING, allowNull: false, field: 'recipient_email' },
    subject: { type: DataTypes.STRING, allowNull: false },
    bodyHtml: { type: DataTypes.TEXT, allowNull: false, field: 'body_html' },
    attachmentUrl: { type: DataTypes.STRING, allowNull: true, field: 'attachment_url' },
    providerName: { type: DataTypes.STRING, defaultValue: 'Brevo', field: 'provider_name' },
    status: { type: DataTypes.ENUM('SENT', 'FAILED', 'PENDING'), defaultValue: 'SENT' },
    failureReason: { type: DataTypes.TEXT, allowNull: true, field: 'failure_reason' },
  },
  {
    sequelize,
    tableName: 'email_logs',
    modelName: 'EmailLog',
    indexes: [{ fields: ['tenant_id'] }, { fields: ['recipient_email'] }],
  }
);
