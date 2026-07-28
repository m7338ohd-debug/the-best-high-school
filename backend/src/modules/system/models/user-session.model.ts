import { DataTypes } from 'sequelize';
import { sequelize } from '../../../database/sequelize.js';
import { BaseModel, baseModelAttributes } from '../../../database/base.model.js';

export interface UserSessionAttributes {
  id: string;
  tenantId: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  refreshToken: string;
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
  lastActiveAt?: Date;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class UserSessionModel extends BaseModel<UserSessionAttributes, Partial<UserSessionAttributes>> implements UserSessionAttributes {
  declare userId: string;
  declare ipAddress: string;
  declare userAgent: string;
  declare refreshToken: string;
  declare status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
  declare lastActiveAt?: Date;
}

UserSessionModel.init(
  {
    ...baseModelAttributes,
    userId: { type: DataTypes.UUID, allowNull: false, field: 'user_id' },
    ipAddress: { type: DataTypes.STRING, defaultValue: '127.0.0.1', field: 'ip_address' },
    userAgent: { type: DataTypes.STRING, defaultValue: 'Mozilla/5.0 (Windows NT 10.0)', field: 'user_agent' },
    refreshToken: { type: DataTypes.STRING, allowNull: false, field: 'refresh_token' },
    status: { type: DataTypes.ENUM('ACTIVE', 'REVOKED', 'EXPIRED'), defaultValue: 'ACTIVE' },
    lastActiveAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'last_active_at' },
  },
  {
    sequelize,
    tableName: 'user_sessions',
    modelName: 'UserSession',
    indexes: [
      { fields: ['tenant_id'] },
      { fields: ['user_id'] },
      { fields: ['refresh_token'], unique: true },
    ],
  }
);
