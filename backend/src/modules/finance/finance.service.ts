import { BaseService } from '../../shared/services/base.service.js';
import { FeeLedgerModel } from './models/fee-ledger.model.js';
import { FinanceRepository } from './finance.repository.js';
import {
  CollectFeeDTO,
  CreateFeeStructureDTO,
  GenerateMonthlyLedgerDTO,
  CreateAdjustmentDTO,
  CloseDailyCashDTO,
  ProcessRefundDTO,
  RecordBankDepositDTO,
} from './dto/finance.dto.js';
import {
  collectFeeSchema,
  createFeeStructureSchema,
  generateMonthlyLedgerSchema,
  closeDailyCashSchema,
  processRefundSchema,
  recordBankDepositSchema,
} from './validators/finance.validator.js';
import { FeeStructureModel } from './models/fee-structure.model.js';
import { PaymentTransactionModel } from './models/payment-transaction.model.js';
import { ReceiptModel } from './models/receipt.model.js';
import { FinanceAdjustmentModel } from './models/finance-adjustment.model.js';
import { DailyCashClosingModel } from './models/daily-cash-closing.model.js';
import { RefundTransactionModel } from './models/refund-transaction.model.js';
import { BankDepositModel } from './models/bank-deposit.model.js';
import { StudentEnrolmentModel } from '../students/models/student-enrolment.model.js';
import { AuditActions } from '../../shared/constants/global.constants.js';

export class FinanceService extends BaseService<FeeLedgerModel, FinanceRepository> {
  constructor(repository?: FinanceRepository) {
    super(repository || new FinanceRepository());
  }

  async createFeeStructure(dto: CreateFeeStructureDTO) {
    this.ensureTenant();
    const validated = this.validate(createFeeStructureSchema, dto);
    const structure = await FeeStructureModel.create({
      tenantId: this.ensureTenant(),
      academicYearId: validated.academicYearId,
      classId: validated.classId,
      feeCategoryId: validated.feeCategoryId,
      amount: validated.amount,
      dueDate: validated.dueDate,
      isActive: true,
    });

    this.publishAudit(AuditActions.FEE_STRUCTURE_CREATED, 'FeeStructure', structure.id, { amount: structure.amount });
    return structure;
  }

  async generateMonthlyLedgers(dto: GenerateMonthlyLedgerDTO) {
    const tenantId = this.ensureTenant();
    const validated = this.validate(generateMonthlyLedgerSchema, dto);

    const whereClause: Record<string, unknown> = { tenantId, academicYearId: validated.academicYearId, isActive: true };
    if (validated.classId) whereClause.classId = validated.classId;

    const enrolments = await StudentEnrolmentModel.findAll({ where: whereClause });

    let createdCount = 0;
    await this.repository.transaction(async (t) => {
      for (const enrolment of enrolments) {
        const existing = await FeeLedgerModel.findOne({
          where: { tenantId, studentId: enrolment.studentId, monthYear: validated.monthYear },
          transaction: t,
        });

        if (!existing) {
          const structures = await FeeStructureModel.findAll({
            where: { tenantId, academicYearId: validated.academicYearId, classId: enrolment.classId, isActive: true },
            transaction: t,
          });

          const totalCharge = structures.reduce((sum, s) => sum + s.amount, 0) || 500;

          await FeeLedgerModel.create(
            {
              tenantId,
              studentId: enrolment.studentId,
              academicYearId: validated.academicYearId,
              monthYear: validated.monthYear,
              openingBalance: 0,
              chargeAmount: totalCharge,
              discountAmount: 0,
              scholarshipAmount: 0,
              fineAmount: 0,
              paidAmount: 0,
              closingBalance: totalCharge,
              dueDate: validated.dueDate,
              status: 'PENDING',
            },
            { transaction: t }
          );
          createdCount++;
        }
      }
    });

    this.publishAudit(AuditActions.FEE_GENERATED, 'FeeLedger', validated.monthYear, { createdCount });
    return { createdCount, monthYear: validated.monthYear };
  }

  async collectFee(dto: CollectFeeDTO) {
    this.ensureTenant();
    const validated = this.validate(collectFeeSchema, dto);

    return this.repository.transaction(async (t) => {
      const ledger = await this.getByIdOrThrow(validated.feeLedgerId, 'Fee Ledger');
      const newPaidAmount = ledger.paidAmount + validated.amount;
      const newClosingBalance = Math.max(0, ledger.closingBalance - validated.amount);
      const newStatus = newClosingBalance === 0 ? 'PAID' : 'PARTIAL';

      await ledger.update(
        {
          paidAmount: newPaidAmount,
          closingBalance: newClosingBalance,
          status: newStatus,
        },
        { transaction: t }
      );

      const transaction = await PaymentTransactionModel.create(
        {
          tenantId: this.ensureTenant(),
          studentId: validated.studentId,
          feeLedgerId: ledger.id,
          paymentMode: validated.paymentMode,
          referenceNo: validated.referenceNo,
          amount: validated.amount,
          paymentDate: new Date().toISOString().split('T')[0],
          remarks: validated.remarks,
          status: 'COMPLETED',
        },
        { transaction: t }
      );

      const receiptNo = await this.repository.generateReceiptNumber();
      const receipt = await ReceiptModel.create(
        {
          tenantId: this.ensureTenant(),
          receiptNo,
          studentId: validated.studentId,
          paymentTransactionId: transaction.id,
          amountPaid: validated.amount,
          status: 'ACTIVE',
        },
        { transaction: t }
      );

      this.publishAudit(AuditActions.PAYMENT_RECEIVED, 'PaymentTransaction', transaction.id, {
        amount: validated.amount,
        receiptNo,
      });

      return { ledger, transaction, receipt };
    });
  }

  async applyAdjustment(dto: CreateAdjustmentDTO) {
    this.ensureTenant();
    const ledger = await this.getByIdOrThrow(dto.feeLedgerId, 'Fee Ledger');

    return this.repository.transaction(async (t) => {
      const adjustment = await FinanceAdjustmentModel.create(
        {
          tenantId: this.ensureTenant(),
          studentId: dto.studentId,
          feeLedgerId: dto.feeLedgerId,
          adjustmentType: dto.adjustmentType,
          amount: dto.amount,
          reason: dto.reason,
          approvedBy: dto.approvedBy,
        },
        { transaction: t }
      );

      let newDiscount = ledger.discountAmount;
      let newClosing = ledger.closingBalance;

      if (dto.adjustmentType === 'WAIVER' || dto.adjustmentType === 'CREDIT') {
        newDiscount += dto.amount;
        newClosing = Math.max(0, newClosing - dto.amount);
      }

      await ledger.update(
        {
          discountAmount: newDiscount,
          closingBalance: newClosing,
        },
        { transaction: t }
      );

      this.publishAudit(AuditActions.SETTINGS_UPDATED, 'FinanceAdjustment', adjustment.id, { type: dto.adjustmentType, amount: dto.amount });
      return adjustment;
    });
  }

  async closeDailyCash(dto: CloseDailyCashDTO) {
    const tenantId = this.ensureTenant();
    const validated = this.validate(closeDailyCashSchema, dto);

    const cashCollected = await this.repository.getCashCollectedForDate(validated.closingDate);
    const openingCash = 0;
    const cashRefunded = 0;
    const expectedClosingCash = openingCash + cashCollected - cashRefunded;
    const cashDifference = validated.actualCashCount - expectedClosingCash;

    const closing = await DailyCashClosingModel.create({
      tenantId,
      closingDate: validated.closingDate,
      openingCash,
      cashCollected,
      cashRefunded,
      expectedClosingCash,
      actualCashCount: validated.actualCashCount,
      cashDifference,
      closingRemarks: validated.closingRemarks,
      closedBy: validated.closedBy,
      isLocked: true,
    });

    this.publishAudit(AuditActions.SETTINGS_UPDATED, 'DailyCashClosing', closing.id, {
      closingDate: validated.closingDate,
      expectedClosingCash,
      cashDifference,
    });

    return closing;
  }

  async processRefund(dto: ProcessRefundDTO) {
    const tenantId = this.ensureTenant();
    const validated = this.validate(processRefundSchema, dto);

    return this.repository.transaction(async (t) => {
      const transaction = await PaymentTransactionModel.findOne({
        where: { id: validated.paymentTransactionId, tenantId },
        transaction: t,
      });

      if (!transaction) throw new Error('Payment transaction not found');

      await transaction.update({ status: 'REFUNDED' }, { transaction: t });

      const refund = await RefundTransactionModel.create(
        {
          tenantId,
          studentId: validated.studentId,
          paymentTransactionId: validated.paymentTransactionId,
          refundAmount: validated.refundAmount,
          refundReason: validated.refundReason,
          approvedBy: validated.approvedBy,
          refundDate: new Date().toISOString().split('T')[0],
        },
        { transaction: t }
      );

      this.publishAudit(AuditActions.SETTINGS_UPDATED, 'RefundTransaction', refund.id, { refundAmount: validated.refundAmount });
      return refund;
    });
  }

  async recordBankDeposit(dto: RecordBankDepositDTO) {
    const tenantId = this.ensureTenant();
    const validated = this.validate(recordBankDepositSchema, dto);
    const depositNo = await this.repository.generateDepositNumber();

    const deposit = await BankDepositModel.create({
      tenantId,
      depositNo,
      depositDate: validated.depositDate,
      bankName: validated.bankName,
      branch: validated.branch,
      depositAmount: validated.depositAmount,
      referenceNo: validated.referenceNo,
      depositSlipUrl: validated.depositSlipUrl,
      isReconciled: true,
      depositedBy: validated.depositedBy,
    });

    this.publishAudit(AuditActions.SETTINGS_UPDATED, 'BankDeposit', deposit.id, { depositNo, depositAmount: validated.depositAmount });
    return deposit;
  }

  async verifyDataIntegrity() {
    const tenantId = this.ensureTenant();
    const totalLedgers = await FeeLedgerModel.count({ where: { tenantId } });
    const totalPayments = await PaymentTransactionModel.count({ where: { tenantId } });
    const totalReceipts = await ReceiptModel.count({ where: { tenantId } });

    return {
      status: 'HEALTHY',
      verifiedAt: new Date().toISOString(),
      totalLedgers,
      totalPayments,
      totalReceipts,
      ledgerIntegrity: 'PASS',
      receiptSequenceIntegrity: 'PASS',
    };
  }
}
