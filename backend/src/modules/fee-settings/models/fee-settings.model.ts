import { DataTypes } from 'sequelize';
import { sequelize } from '../../../database/sequelize.js';
import { BaseModel, baseModelAttributes } from '../../../database/base.model.js';

export interface FeeSettingsAttributes {
  id: string;
  tenantId: string;
  gracePeriodDays: number;
  lateFeeEnabled: boolean;
  lateFeeType: 'FIXED' | 'PERCENTAGE';
  lateFeeAmount: number;
  maximumFine: number;
  autoGenerateMonthlyFees: boolean;
  allowPartialPayments: boolean;
  allowAdvancePayments: boolean;
  allowDiscounts: boolean;
  allowScholarships: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class FeeSettingsModel extends BaseModel<FeeSettingsAttributes, Partial<FeeSettingsAttributes>> implements FeeSettingsAttributes {
  declare gracePeriodDays: number;
  declare lateFeeEnabled: boolean;
  declare lateFeeType: 'FIXED' | 'PERCENTAGE';
  declare lateFeeAmount: number;
  declare maximumFine: number;
  declare autoGenerateMonthlyFees: boolean;
  declare allowPartialPayments: boolean;
  declare allowAdvancePayments: boolean;
  declare allowDiscounts: boolean;
  declare allowScholarships: boolean;
}

FeeSettingsModel.init(
  {
    ...baseModelAttributes,
    gracePeriodDays: { type: DataTypes.INTEGER, defaultValue: 7, field: 'grace_period_days' },
    lateFeeEnabled: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'late_fee_enabled' },
    lateFeeType: { type: DataTypes.ENUM('FIXED', 'PERCENTAGE'), defaultValue: 'FIXED', field: 'late_fee_type' },
    lateFeeAmount: { type: DataTypes.FLOAT, defaultValue: 50, field: 'late_fee_amount' },
    maximumFine: { type: DataTypes.FLOAT, defaultValue: 500, field: 'maximum_fine' },
    autoGenerateMonthlyFees: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'auto_generate_monthly_fees' },
    allowPartialPayments: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'allow_partial_payments' },
    allowAdvancePayments: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'allow_advance_payments' },
    allowDiscounts: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'allow_discounts' },
    allowScholarships: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'allow_scholarships' },
  },
  {
    sequelize,
    tableName: 'fee_settings',
    modelName: 'FeeSettings',
    indexes: [{ fields: ['tenant_id'] }],
  }
);
