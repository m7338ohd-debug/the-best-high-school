import { DataTypes } from 'sequelize';
import { sequelize } from '../../../database/sequelize.js';
import { BaseModel, baseModelAttributes } from '../../../database/base.model.js';

export interface PaymentTransactionAttributes {
  id: string;
  tenantId: string;
  studentId: string;
  feeLedgerId: string;
  paymentMode: 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CARD' | 'CHEQUE';
  referenceNo?: string;
  amount: number;
  paymentDate: string;
  remarks?: string;
  collectedBy?: string;
  status: 'COMPLETED' | 'REFUNDED' | 'VOID';
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class PaymentTransactionModel extends BaseModel<PaymentTransactionAttributes, Partial<PaymentTransactionAttributes>> implements PaymentTransactionAttributes {
  declare studentId: string;
  declare feeLedgerId: string;
  declare paymentMode: 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CARD' | 'CHEQUE';
  declare referenceNo?: string;
  declare amount: number;
  declare paymentDate: string;
  declare remarks?: string;
  declare collectedBy?: string;
  declare status: 'COMPLETED' | 'REFUNDED' | 'VOID';
}

PaymentTransactionModel.init(
  {
    ...baseModelAttributes,
    studentId: { type: DataTypes.UUID, allowNull: false, field: 'student_id' },
    feeLedgerId: { type: DataTypes.UUID, allowNull: false, field: 'fee_ledger_id' },
    paymentMode: { type: DataTypes.ENUM('CASH', 'UPI', 'BANK_TRANSFER', 'CARD', 'CHEQUE'), allowNull: false, field: 'payment_mode' },
    referenceNo: { type: DataTypes.STRING, allowNull: true, field: 'reference_no' },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    paymentDate: { type: DataTypes.DATEONLY, allowNull: false, field: 'payment_date' },
    remarks: { type: DataTypes.STRING, allowNull: true },
    collectedBy: { type: DataTypes.STRING, allowNull: true, field: 'collected_by' },
    status: { type: DataTypes.ENUM('COMPLETED', 'REFUNDED', 'VOID'), defaultValue: 'COMPLETED' },
  },
  {
    sequelize,
    tableName: 'payment_transactions',
    modelName: 'PaymentTransaction',
    indexes: [{ fields: ['tenant_id'] }, { fields: ['student_id'] }, { fields: ['payment_date'] }],
  }
);
