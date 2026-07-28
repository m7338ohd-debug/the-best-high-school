import { DataTypes } from 'sequelize';
import { sequelize } from '../../../database/sequelize.js';
import { BaseModel, baseModelAttributes } from '../../../database/base.model.js';

export interface ReceiptAttributes {
  id: string;
  tenantId: string;
  receiptNo: string; // e.g. "REC-2026-000142"
  studentId: string;
  paymentTransactionId: string;
  amountPaid: number;
  pdfUrl?: string;
  status: 'ACTIVE' | 'CANCELLED';
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class ReceiptModel extends BaseModel<ReceiptAttributes, Partial<ReceiptAttributes>> implements ReceiptAttributes {
  declare receiptNo: string;
  declare studentId: string;
  declare paymentTransactionId: string;
  declare amountPaid: number;
  declare pdfUrl?: string;
  declare status: 'ACTIVE' | 'CANCELLED';
}

ReceiptModel.init(
  {
    ...baseModelAttributes,
    receiptNo: { type: DataTypes.STRING, allowNull: false, field: 'receipt_no' },
    studentId: { type: DataTypes.UUID, allowNull: false, field: 'student_id' },
    paymentTransactionId: { type: DataTypes.UUID, allowNull: false, field: 'payment_transaction_id' },
    amountPaid: { type: DataTypes.FLOAT, allowNull: false, field: 'amount_paid' },
    pdfUrl: { type: DataTypes.STRING, allowNull: true, field: 'pdf_url' },
    status: { type: DataTypes.ENUM('ACTIVE', 'CANCELLED'), defaultValue: 'ACTIVE' },
  },
  {
    sequelize,
    tableName: 'receipts',
    modelName: 'Receipt',
    indexes: [
      { fields: ['tenant_id'] },
      { fields: ['tenant_id', 'receipt_no'], unique: true },
      { fields: ['student_id'] },
    ],
  }
);
