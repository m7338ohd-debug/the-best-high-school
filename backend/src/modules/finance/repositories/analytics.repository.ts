import { BaseRepository } from '../../../shared/repositories/base.repository.js';
import { FeeLedgerModel } from '../models/fee-ledger.model.js';
import { PaymentTransactionModel } from '../models/payment-transaction.model.js';
import { ReceiptModel } from '../models/receipt.model.js';
import { RefundTransactionModel } from '../models/refund-transaction.model.js';
import { TenantContext } from '../../../shared/context/tenant.context.js';
import { Op } from 'sequelize';

export class AnalyticsRepository extends BaseRepository<FeeLedgerModel> {
  constructor() {
    super(FeeLedgerModel);
  }

  async getExecutiveMetrics() {
    const tenantId = TenantContext.getTenantId();
    const todayStr = new Date().toISOString().split('T')[0];

    const todayTransactions = await PaymentTransactionModel.findAll({
      where: { tenantId, paymentDate: todayStr, status: 'COMPLETED' },
    });
    const todayCollection = todayTransactions.reduce((sum, tx) => sum + tx.amount, 0);

    const allLedgers = await FeeLedgerModel.findAll({ where: { tenantId } });
    const totalCharges = allLedgers.reduce((sum, l) => sum + l.chargeAmount, 0);
    const totalPaid = allLedgers.reduce((sum, l) => sum + l.paidAmount, 0);
    const totalOutstanding = allLedgers.reduce((sum, l) => sum + l.closingBalance, 0);

    const totalRefunds = await RefundTransactionModel.count({ where: { tenantId } });
    const totalReceipts = await ReceiptModel.count({ where: { tenantId, status: 'ACTIVE' } });

    const collectionEfficiency = totalCharges > 0 ? ((totalPaid / totalCharges) * 100).toFixed(1) : '100.0';

    return {
      todayCollection,
      monthlyCollection: totalPaid,
      annualCollection: totalPaid * 1.2,
      expectedRevenue: totalCharges,
      collectedRevenue: totalPaid,
      outstandingRevenue: totalOutstanding,
      collectionEfficiency: `${collectionEfficiency}%`,
      totalReceipts,
      totalRefunds,
      healthScore: 100,
    };
  }

  async searchFinanceRecords(query: string) {
    const tenantId = TenantContext.getTenantId();
    const receipts = await ReceiptModel.findAll({
      where: { tenantId, receiptNo: { [Op.like]: `%${query}%` } },
      limit: 10,
    });

    const transactions = await PaymentTransactionModel.findAll({
      where: { tenantId, referenceNo: { [Op.like]: `%${query}%` } },
      limit: 10,
    });

    return { receipts, transactions };
  }
}
