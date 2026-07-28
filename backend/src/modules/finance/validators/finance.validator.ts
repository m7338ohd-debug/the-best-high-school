import { z } from 'zod';

export const createFeeStructureSchema = z.object({
  academicYearId: z.string().uuid('Invalid Academic Year ID'),
  classId: z.string().uuid('Invalid Class ID'),
  feeCategoryId: z.string().uuid('Invalid Fee Category ID'),
  amount: z.number().positive('Amount must be greater than zero'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
});

export const collectFeeSchema = z.object({
  studentId: z.string().uuid('Invalid Student ID'),
  feeLedgerId: z.string().uuid('Invalid Fee Ledger ID'),
  amount: z.number().positive('Amount must be greater than zero'),
  paymentMode: z.enum(['CASH', 'UPI', 'BANK_TRANSFER', 'CARD', 'CHEQUE']),
  referenceNo: z.string().optional(),
  remarks: z.string().optional(),
});

export const generateMonthlyLedgerSchema = z.object({
  academicYearId: z.string().uuid('Invalid Academic Year ID'),
  classId: z.string().uuid().optional(),
  monthYear: z.string().regex(/^\d{4}-\d{2}$/, 'Format must be YYYY-MM'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
});

export const closeDailyCashSchema = z.object({
  closingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  actualCashCount: z.number().min(0),
  closingRemarks: z.string().optional(),
  closedBy: z.string().min(1, 'Closed by user name is required'),
});

export const processRefundSchema = z.object({
  studentId: z.string().uuid('Invalid Student ID'),
  paymentTransactionId: z.string().uuid('Invalid Payment Transaction ID'),
  refundAmount: z.number().positive('Refund amount must be greater than zero'),
  refundReason: z.string().min(1, 'Refund reason is required'),
  approvedBy: z.string().min(1, 'Approved by name is required'),
});

export const recordBankDepositSchema = z.object({
  depositDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  bankName: z.string().min(1, 'Bank name is required'),
  branch: z.string().optional(),
  depositAmount: z.number().positive('Deposit amount must be greater than zero'),
  referenceNo: z.string().optional(),
  depositSlipUrl: z.string().optional(),
  depositedBy: z.string().min(1, 'Deposited by name is required'),
});
