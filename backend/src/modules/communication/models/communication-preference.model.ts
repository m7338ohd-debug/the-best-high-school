import { DataTypes } from 'sequelize';
import { sequelize } from '../../../database/sequelize.js';
import { BaseModel, baseModelAttributes } from '../../../database/base.model.js';

export interface CommunicationPreferenceAttributes {
  id: string;
  tenantId: string;
  parentId: string;
  smsEnabled: boolean;
  emailEnabled: boolean;
  whatsappEnabled: boolean;
  preferredChannel: 'SMS' | 'EMAIL' | 'WHATSAPP';
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class CommunicationPreferenceModel extends BaseModel<CommunicationPreferenceAttributes, Partial<CommunicationPreferenceAttributes>> implements CommunicationPreferenceAttributes {
  declare parentId: string;
  declare smsEnabled: boolean;
  declare emailEnabled: boolean;
  declare whatsappEnabled: boolean;
  declare preferredChannel: 'SMS' | 'EMAIL' | 'WHATSAPP';
}

CommunicationPreferenceModel.init(
  {
    ...baseModelAttributes,
    parentId: { type: DataTypes.UUID, allowNull: false, field: 'parent_id' },
    smsEnabled: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'sms_enabled' },
    emailEnabled: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'email_enabled' },
    whatsappEnabled: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'whatsapp_enabled' },
    preferredChannel: { type: DataTypes.ENUM('SMS', 'EMAIL', 'WHATSAPP'), defaultValue: 'EMAIL', field: 'preferred_channel' },
  },
  {
    sequelize,
    tableName: 'communication_preferences',
    modelName: 'CommunicationPreference',
    indexes: [
      { fields: ['tenant_id'] },
      { fields: ['tenant_id', 'parent_id'], unique: true },
    ],
  }
);
