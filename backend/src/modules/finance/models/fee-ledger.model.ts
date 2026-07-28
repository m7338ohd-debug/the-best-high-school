import { DataTypes } from 'sequelize';
import { sequelize } from '../../../database/sequelize.js';
import { BaseModel, baseModelAttributes } from '../../../database/base.model.js';

export interface FeeLedgerAttributes {
  id: string;
  tenantId: string;
  studentId: string;
  academicYearId: string;
  feeStructureId?: string;
  monthYear: string; // e.g. "2026-07"
  openingBalance: number;
  chargeAmount: number;
  discountAmount: number;
  scholarshipAmount: number;
  fineAmount: number;
  paidAmount: number;
  closingBalance: number;
  dueDate: string;
  status: 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class FeeLedgerModel extends BaseModel<FeeLedgerAttributes, Partial<FeeLedgerAttributes>> implements FeeLedgerAttributes {
  declare studentId: string;
  declare academicYearId: string;
  declare feeStructureId?: string;
  declare monthYear: string;
  declare openingBalance: number;
  declare chargeAmount: number;
  declare discountAmount: number;
  declare scholarshipAmount: number;
  declare fineAmount: number;
  declare paidAmount: number;
  declare closingBalance: number;
  declare dueDate: string;
  declare status: 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'CANCELLED';
}

FeeLedgerModel.init(
  {
    ...baseModelAttributes,
    studentId: { type: DataTypes.UUID, allowNull: false, field: 'student_id' },
    academicYearId: { type: DataTypes.UUID, allowNull: false, field: 'academic_year_id' },
    feeStructureId: { type: DataTypes.UUID, allowNull: true, field: 'fee_structure_id' },
    monthYear: { type: DataTypes.STRING, allowNull: false, field: 'month_year' },
    openingBalance: { type: DataTypes.FLOAT, defaultValue: 0, field: 'opening_balance' },
    chargeAmount: { type: DataTypes.FLOAT, defaultValue: 0, field: 'charge_amount' },
    discountAmount: { type: DataTypes.FLOAT, defaultValue: 0, field: 'discount_amount' },
    scholarshipAmount: { type: DataTypes.FLOAT, defaultValue: 0, field: 'scholarship_amount' },
    fineAmount: { type: DataTypes.FLOAT, defaultValue: 0, field: 'fine_amount' },
    paidAmount: { type: DataTypes.FLOAT, defaultValue: 0, field: 'paid_amount' },
    closingBalance: { type: DataTypes.FLOAT, defaultValue: 0, field: 'closing_balance' },
    dueDate: { type: DataTypes.DATEONLY, allowNull: false, field: 'due_date' },
    status: { type: DataTypes.ENUM('PENDING', 'PARTIAL', 'PAID', 'OVERDUE', 'CANCELLED'), defaultValue: 'PENDING' },
  },
  {
    sequelize,
    tableName: 'fee_ledgers',
    modelName: 'FeeLedger',
    indexes: [
      { fields: ['tenant_id'] },
      { fields: ['tenant_id', 'student_id', 'month_year'], unique: true },
      { fields: ['tenant_id', 'status'] },
    ],
  }
);
