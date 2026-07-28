import { DataTypes } from 'sequelize';
import { sequelize } from '../../../database/sequelize.js';
import { BaseModel, baseModelAttributes } from '../../../database/base.model.js';

export interface NotificationTemplateAttributes {
  id: string;
  tenantId: string;
  templateName: string;
  channel: 'SMS' | 'EMAIL' | 'WHATSAPP';
  subject?: string;
  bodyContent: string;
  variables: string[]; // e.g. ["StudentName", "ReceiptNumber", "Amount"]
  isActive: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class NotificationTemplateModel extends BaseModel<NotificationTemplateAttributes, Partial<NotificationTemplateAttributes>> implements NotificationTemplateAttributes {
  declare templateName: string;
  declare channel: 'SMS' | 'EMAIL' | 'WHATSAPP';
  declare subject?: string;
  declare bodyContent: string;
  declare variables: string[];
  declare isActive: boolean;
}

NotificationTemplateModel.init(
  {
    ...baseModelAttributes,
    templateName: { type: DataTypes.STRING, allowNull: false, field: 'template_name' },
    channel: { type: DataTypes.ENUM('SMS', 'EMAIL', 'WHATSAPP'), allowNull: false },
    subject: { type: DataTypes.STRING, allowNull: true },
    bodyContent: { type: DataTypes.TEXT, allowNull: false, field: 'body_content' },
    variables: { type: DataTypes.JSON, defaultValue: [] },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_active' },
  },
  {
    sequelize,
    tableName: 'notification_templates',
    modelName: 'NotificationTemplate',
    indexes: [{ fields: ['tenant_id'] }, { fields: ['channel'] }],
  }
);
