import { BaseRepository } from '../../shared/repositories/base.repository.js';
import { FeeLedgerModel } from './models/fee-ledger.model.js';
import { ReceiptModel } from './models/receipt.model.js';
import { PaymentTransactionModel } from './models/payment-transaction.model.js';
import { BankDepositModel } from './models/bank-deposit.model.js';
import { TenantContext } from '../../shared/context/tenant.context.js';

export class FinanceRepository extends BaseRepository<FeeLedgerModel> {
  constructor() {
    super(FeeLedgerModel);
  }

  async generateReceiptNumber(year = '2026'): Promise<string> {
    const tenantId = TenantContext.getTenantId();
    const count = await ReceiptModel.count({ where: { tenantId } });
    const sequence = String(count + 1).padStart(6, '0');
    return `REC-${year}-${sequence}`;
  }

  async generateDepositNumber(year = '2026'): Promise<string> {
    const tenantId = TenantContext.getTenantId();
    const count = await BankDepositModel.count({ where: { tenantId } });
    const sequence = String(count + 1).padStart(6, '0');
    return `DEP-${year}-${sequence}`;
  }

  async findStudentLedgers(studentId: string): Promise<FeeLedgerModel[]> {
    return this.findAll({ where: { studentId }, order: [['createdAt', 'DESC']] });
  }

  async getRecentTransactions(): Promise<PaymentTransactionModel[]> {
    const tenantId = TenantContext.getTenantId();
    return PaymentTransactionModel.findAll({
      where: { tenantId },
      order: [['createdAt', 'DESC']],
      limit: 20,
    });
  }

  async getCashCollectedForDate(date: string): Promise<number> {
    const tenantId = TenantContext.getTenantId();
    const transactions = await PaymentTransactionModel.findAll({
      where: { tenantId, paymentDate: date, paymentMode: 'CASH', status: 'COMPLETED' },
    });
    return transactions.reduce((sum, tx) => sum + tx.amount, 0);
  }
}
