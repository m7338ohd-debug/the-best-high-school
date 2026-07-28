import { DataTypes } from 'sequelize';
import { sequelize } from '../../../database/sequelize.js';
import { BaseModel, baseModelAttributes } from '../../../database/base.model.js';

export interface RefundTransactionAttributes {
  id: string;
  tenantId: string;
  studentId: string;
  paymentTransactionId: string;
  refundAmount: number;
  refundReason: string;
  approvedBy: string;
  refundDate: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class RefundTransactionModel extends BaseModel<RefundTransactionAttributes, Partial<RefundTransactionAttributes>> implements RefundTransactionAttributes {
  declare studentId: string;
  declare paymentTransactionId: string;
  declare refundAmount: number;
  declare refundReason: string;
  declare approvedBy: string;
  declare refundDate: string;
}

RefundTransactionModel.init(
  {
    ...baseModelAttributes,
    studentId: { type: DataTypes.UUID, allowNull: false, field: 'student_id' },
    paymentTransactionId: { type: DataTypes.UUID, allowNull: false, field: 'payment_transaction_id' },
    refundAmount: { type: DataTypes.FLOAT, allowNull: false, field: 'refund_amount' },
    refundReason: { type: DataTypes.TEXT, allowNull: false, field: 'refund_reason' },
    approvedBy: { type: DataTypes.STRING, allowNull: false, field: 'approved_by' },
    refundDate: { type: DataTypes.DATEONLY, allowNull: false, field: 'refund_date' },
  },
  {
    sequelize,
    tableName: 'refund_transactions',
    modelName: 'RefundTransaction',
    indexes: [{ fields: ['tenant_id'] }, { fields: ['payment_transaction_id'] }],
  }
);
