export type PaymentChannel = 'CASH' | 'UPI' | 'CARD' | 'CHEQUE' | 'BANK_TRANSFER' | 'WALLET';
export type FeeStatus = 'Paid' | 'Partially Paid' | 'Pending';
export type TransactionType = 'FEE_GENERATED' | 'PAYMENT' | 'REFUND' | 'DISCOUNT' | 'WAIVER' | 'LATE_FINE';

export interface FeeItem {
  id: string;
  category: string;
  monthTerm: string;
  originalAmount: number;
  discountAmount: number;
  fineAmount: number;
  amountPaid: number;
  balanceDue: number;
  dueDate: string;
  status: 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE';
}

export interface StudentFinancialProfile {
  id: string;
  admissionNo: string;
  rollNo: string;
  studentName: string;
  className: string;
  sectionName: string;
  academicYear: string;
  parentName: string;
  parentRelation: string;
  contact: string;
  email: string;
  avatarUrl?: string;
  status: 'ACTIVE' | 'INACTIVE';
  admissionDate: string;
  feeStatus: FeeStatus;
  totalFees: number;
  totalPaid: number;
  totalPending?: number;
  totalDiscount?: number;
  totalScholarship?: number;
  totalLateFine?: number;
  totalRefund?: number;
  outstandingBalance: number;
  discounts: number;
  scholarships: number;
  lateFine: number;
  refunds: number;
  lastPaymentDate: string;
  nextDueDate: string;
  assignedFees: FeeItem[];
}

export interface ClassSummaryCard {
  id: string;
  className: string;
  totalStudents: number;
  paidStudents: number;
  pendingStudents: number;
  outstandingFees: number;
}

export interface LedgerEntry {
  id: string;
  date: string;
  type: TransactionType;
  description: string;
  amount: number;
  balanceAfter: number;
  receiptNo?: string;
  collectorName?: string;
  paymentChannel?: PaymentChannel;
}
