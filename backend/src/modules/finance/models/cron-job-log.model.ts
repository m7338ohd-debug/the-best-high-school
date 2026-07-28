import { DataTypes } from 'sequelize';
import { sequelize } from '../../../database/sequelize.js';
import { BaseModel, baseModelAttributes } from '../../../database/base.model.js';

export interface CronJobLogAttributes {
  id: string;
  tenantId: string;
  jobName: string;
  status: 'SUCCESS' | 'FAILED' | 'RETRYING';
  executionTimeMs: number;
  errorMessage?: string;
  retryCount: number;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class CronJobLogModel extends BaseModel<CronJobLogAttributes, Partial<CronJobLogAttributes>> implements CronJobLogAttributes {
  declare jobName: string;
  declare status: 'SUCCESS' | 'FAILED' | 'RETRYING';
  declare executionTimeMs: number;
  declare errorMessage?: string;
  declare retryCount: number;
}

CronJobLogModel.init(
  {
    ...baseModelAttributes,
    jobName: { type: DataTypes.STRING, allowNull: false, field: 'job_name' },
    status: { type: DataTypes.ENUM('SUCCESS', 'FAILED', 'RETRYING'), defaultValue: 'SUCCESS' },
    executionTimeMs: { type: DataTypes.INTEGER, defaultValue: 0, field: 'execution_time_ms' },
    errorMessage: { type: DataTypes.TEXT, allowNull: true, field: 'error_message' },
    retryCount: { type: DataTypes.INTEGER, defaultValue: 0, field: 'retry_count' },
  },
  {
    sequelize,
    tableName: 'cron_job_logs',
    modelName: 'CronJobLog',
    indexes: [{ fields: ['tenant_id'] }, { fields: ['job_name'] }],
  }
);
