import { DataTypes } from 'sequelize';
import { sequelize } from '../../../database/sequelize.js';
import { BaseModel, baseModelAttributes } from '../../../database/base.model.js';

export interface BackupLogAttributes {
  id: string;
  tenantId: string;
  backupName: string;
  filePath: string;
  fileSizeMb: number;
  backupType: 'MANUAL' | 'AUTOMATED';
  status: 'COMPLETED' | 'FAILED' | 'RESTORING';
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class BackupLogModel extends BaseModel<BackupLogAttributes, Partial<BackupLogAttributes>> implements BackupLogAttributes {
  declare backupName: string;
  declare filePath: string;
  declare fileSizeMb: number;
  declare backupType: 'MANUAL' | 'AUTOMATED';
  declare status: 'COMPLETED' | 'FAILED' | 'RESTORING';
}

BackupLogModel.init(
  {
    ...baseModelAttributes,
    backupName: { type: DataTypes.STRING, allowNull: false, field: 'backup_name' },
    filePath: { type: DataTypes.STRING, allowNull: false, field: 'file_path' },
    fileSizeMb: { type: DataTypes.FLOAT, defaultValue: 4.2, field: 'file_size_mb' },
    backupType: { type: DataTypes.ENUM('MANUAL', 'AUTOMATED'), defaultValue: 'MANUAL', field: 'backup_type' },
    status: { type: DataTypes.ENUM('COMPLETED', 'FAILED', 'RESTORING'), defaultValue: 'COMPLETED' },
  },
  {
    sequelize,
    tableName: 'backup_logs',
    modelName: 'BackupLog',
    indexes: [{ fields: ['tenant_id'] }, { fields: ['status'] }],
  }
);
