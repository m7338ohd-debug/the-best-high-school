export interface CreateFeeStructureDTO {
  academicYearId: string;
  classId: string;
  feeCategoryId: string;
  amount: number;
  dueDate: string;
}

export interface CollectFeeDTO {
  studentId: string;
  feeLedgerId: string;
  amount: number;
  paymentMode: 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CARD' | 'CHEQUE';
  referenceNo?: string;
  remarks?: string;
}

export interface GenerateMonthlyLedgerDTO {
  academicYearId: string;
  classId?: string;
  monthYear: string;
  dueDate: string;
}

export interface CreateAdjustmentDTO {
  studentId: string;
  feeLedgerId: string;
  adjustmentType: 'CREDIT' | 'DEBIT' | 'WAIVER' | 'SCHOLARSHIP_GRANT';
  amount: number;
  reason: string;
  approvedBy: string;
}

export interface CloseDailyCashDTO {
  closingDate: string;
  actualCashCount: number;
  closingRemarks?: string;
  closedBy: string;
}

export interface ProcessRefundDTO {
  studentId: string;
  paymentTransactionId: string;
  refundAmount: number;
  refundReason: string;
  approvedBy: string;
}

export interface RecordBankDepositDTO {
  depositDate: string;
  bankName: string;
  branch?: string;
  depositAmount: number;
  referenceNo?: string;
  depositSlipUrl?: string;
  depositedBy: string;
}
