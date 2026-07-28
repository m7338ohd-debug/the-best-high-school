import { DataTypes } from 'sequelize';
import { sequelize } from '../../../database/sequelize.js';
import { BaseModel, baseModelAttributes } from '../../../database/base.model.js';

export interface DailyCashClosingAttributes {
  id: string;
  tenantId: string;
  closingDate: string; // e.g. "2026-07-27"
  openingCash: number;
  cashCollected: number;
  cashRefunded: number;
  expectedClosingCash: number;
  actualCashCount: number;
  cashDifference: number;
  closingRemarks?: string;
  closedBy: string;
  isLocked: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class DailyCashClosingModel extends BaseModel<DailyCashClosingAttributes, Partial<DailyCashClosingAttributes>> implements DailyCashClosingAttributes {
  declare closingDate: string;
  declare openingCash: number;
  declare cashCollected: number;
  declare cashRefunded: number;
  declare expectedClosingCash: number;
  declare actualCashCount: number;
  declare cashDifference: number;
  declare closingRemarks?: string;
  declare closedBy: string;
  declare isLocked: boolean;
}

DailyCashClosingModel.init(
  {
    ...baseModelAttributes,
    closingDate: { type: DataTypes.DATEONLY, allowNull: false, field: 'closing_date' },
    openingCash: { type: DataTypes.FLOAT, defaultValue: 0, field: 'opening_cash' },
    cashCollected: { type: DataTypes.FLOAT, defaultValue: 0, field: 'cash_collected' },
    cashRefunded: { type: DataTypes.FLOAT, defaultValue: 0, field: 'cash_refunded' },
    expectedClosingCash: { type: DataTypes.FLOAT, defaultValue: 0, field: 'expected_closing_cash' },
    actualCashCount: { type: DataTypes.FLOAT, defaultValue: 0, field: 'actual_cash_count' },
    cashDifference: { type: DataTypes.FLOAT, defaultValue: 0, field: 'cash_difference' },
    closingRemarks: { type: DataTypes.TEXT, allowNull: true, field: 'closing_remarks' },
    closedBy: { type: DataTypes.STRING, allowNull: false, field: 'closed_by' },
    isLocked: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_locked' },
  },
  {
    sequelize,
    tableName: 'daily_cash_closings',
    modelName: 'DailyCashClosing',
    indexes: [
      { fields: ['tenant_id'] },
      { fields: ['tenant_id', 'closing_date'], unique: true },
    ],
  }
);
