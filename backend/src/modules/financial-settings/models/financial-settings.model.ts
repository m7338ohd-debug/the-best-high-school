import { DataTypes } from 'sequelize';
import { sequelize } from '../../../database/sequelize.js';
import { BaseModel, baseModelAttributes } from '../../../database/base.model.js';

export interface FinancialSettingsAttributes {
  id: string;
  tenantId: string;
  currency: string;
  currencySymbol: string;
  financialYear: string;
  receiptPrefix: string;
  receiptNumberFormat: string;
  invoicePrefix: string;
  decimalPrecision: number;
  taxPercentage?: number;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class FinancialSettingsModel extends BaseModel<FinancialSettingsAttributes, Partial<FinancialSettingsAttributes>> implements FinancialSettingsAttributes {
  declare currency: string;
  declare currencySymbol: string;
  declare financialYear: string;
  declare receiptPrefix: string;
  declare receiptNumberFormat: string;
  declare invoicePrefix: string;
  declare decimalPrecision: number;
  declare taxPercentage?: number;
}

FinancialSettingsModel.init(
  {
    ...baseModelAttributes,
    currency: { type: DataTypes.STRING, defaultValue: 'USD' },
    currencySymbol: { type: DataTypes.STRING, defaultValue: '$', field: 'currency_symbol' },
    financialYear: { type: DataTypes.STRING, defaultValue: '2026-2027', field: 'financial_year' },
    receiptPrefix: { type: DataTypes.STRING, defaultValue: 'REC', field: 'receipt_prefix' },
    receiptNumberFormat: { type: DataTypes.STRING, defaultValue: '{PREFIX}-{YEAR}-{SEQUENCE}', field: 'receipt_number_format' },
    invoicePrefix: { type: DataTypes.STRING, defaultValue: 'INV', field: 'invoice_prefix' },
    decimalPrecision: { type: DataTypes.INTEGER, defaultValue: 2, field: 'decimal_precision' },
    taxPercentage: { type: DataTypes.FLOAT, defaultValue: 0, field: 'tax_percentage' },
  },
  {
    sequelize,
    tableName: 'financial_settings',
    modelName: 'FinancialSettings',
    indexes: [{ fields: ['tenant_id'] }],
  }
);
