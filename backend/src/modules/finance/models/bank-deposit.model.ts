import { DataTypes } from 'sequelize';
import { sequelize } from '../../../database/sequelize.js';
import { BaseModel, baseModelAttributes } from '../../../database/base.model.js';

export interface BankDepositAttributes {
  id: string;
  tenantId: string;
  depositNo: string; // e.g. "DEP-2026-000042"
  depositDate: string;
  bankName: string;
  branch?: string;
  depositAmount: number;
  referenceNo?: string;
  depositSlipUrl?: string;
  isReconciled: boolean;
  depositedBy: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class BankDepositModel extends BaseModel<BankDepositAttributes, Partial<BankDepositAttributes>> implements BankDepositAttributes {
  declare depositNo: string;
  declare depositDate: string;
  declare bankName: string;
  declare branch?: string;
  declare depositAmount: number;
  declare referenceNo?: string;
  declare depositSlipUrl?: string;
  declare isReconciled: boolean;
  declare depositedBy: string;
}

BankDepositModel.init(
  {
    ...baseModelAttributes,
    depositNo: { type: DataTypes.STRING, allowNull: false, field: 'deposit_no' },
    depositDate: { type: DataTypes.DATEONLY, allowNull: false, field: 'deposit_date' },
    bankName: { type: DataTypes.STRING, allowNull: false, field: 'bank_name' },
    branch: { type: DataTypes.STRING, allowNull: true },
    depositAmount: { type: DataTypes.FLOAT, allowNull: false, field: 'deposit_amount' },
    referenceNo: { type: DataTypes.STRING, allowNull: true, field: 'reference_no' },
    depositSlipUrl: { type: DataTypes.STRING, allowNull: true, field: 'deposit_slip_url' },
    isReconciled: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_reconciled' },
    depositedBy: { type: DataTypes.STRING, allowNull: false, field: 'deposited_by' },
  },
  {
    sequelize,
    tableName: 'bank_deposits',
    modelName: 'BankDeposit',
    indexes: [
      { fields: ['tenant_id'] },
      { fields: ['tenant_id', 'deposit_no'], unique: true },
      { fields: ['tenant_id', 'is_reconciled'] },
    ],
  }
);
