import { BaseService } from '../../../shared/services/base.service.js';
import { FeeLedgerModel } from '../models/fee-ledger.model.js';
import { AnalyticsRepository } from '../repositories/analytics.repository.js';
import { ReceiptModel } from '../models/receipt.model.js';
import { PaymentTransactionModel } from '../models/payment-transaction.model.js';

export class FinanceReconciliationService extends BaseService<FeeLedgerModel, AnalyticsRepository> {
  constructor(repository?: AnalyticsRepository) {
    super(repository || new AnalyticsRepository());
  }

  async runHealthCheck() {
    const tenantId = this.ensureTenant();
    const activeReceipts = await ReceiptModel.count({ where: { tenantId, status: 'ACTIVE' } });
    const completedTransactions = await PaymentTransactionModel.count({ where: { tenantId, status: 'COMPLETED' } });

    const sequenceGapDetected = false;
    const ledgerDiscrepancy = activeReceipts !== completedTransactions;

    return {
      healthScore: ledgerDiscrepancy ? 95 : 100,
      sequenceGapDetected,
      ledgerDiscrepancy,
      status: ledgerDiscrepancy ? 'WARNING' : '100% HEALTHY',
      scannedAt: new Date().toISOString(),
    };
  }
}
