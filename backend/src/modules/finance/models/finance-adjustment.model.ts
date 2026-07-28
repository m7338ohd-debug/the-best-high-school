import { DataTypes } from 'sequelize';
import { sequelize } from '../../../database/sequelize.js';
import { BaseModel, baseModelAttributes } from '../../../database/base.model.js';

export interface FinanceAdjustmentAttributes {
  id: string;
  tenantId: string;
  studentId: string;
  feeLedgerId: string;
  adjustmentType: 'CREDIT' | 'DEBIT' | 'WAIVER' | 'SCHOLARSHIP_GRANT';
  amount: number;
  reason: string;
  approvedBy: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class FinanceAdjustmentModel extends BaseModel<FinanceAdjustmentAttributes, Partial<FinanceAdjustmentAttributes>> implements FinanceAdjustmentAttributes {
  declare studentId: string;
  declare feeLedgerId: string;
  declare adjustmentType: 'CREDIT' | 'DEBIT' | 'WAIVER' | 'SCHOLARSHIP_GRANT';
  declare amount: number;
  declare reason: string;
  declare approvedBy: string;
}

FinanceAdjustmentModel.init(
  {
    ...baseModelAttributes,
    studentId: { type: DataTypes.UUID, allowNull: false, field: 'student_id' },
    feeLedgerId: { type: DataTypes.UUID, allowNull: false, field: 'fee_ledger_id' },
    adjustmentType: { type: DataTypes.ENUM('CREDIT', 'DEBIT', 'WAIVER', 'SCHOLARSHIP_GRANT'), allowNull: false, field: 'adjustment_type' },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    reason: { type: DataTypes.TEXT, allowNull: false },
    approvedBy: { type: DataTypes.STRING, allowNull: false, field: 'approved_by' },
  },
  {
    sequelize,
    tableName: 'finance_adjustments',
    modelName: 'FinanceAdjustment',
    indexes: [{ fields: ['tenant_id'] }, { fields: ['student_id'] }],
  }
);
