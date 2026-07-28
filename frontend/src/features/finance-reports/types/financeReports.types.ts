export type ExportFormat = 'PDF' | 'EXCEL' | 'CSV' | 'PRINT';

export type FeePaymentStatus = 'Paid' | 'Partial' | 'Pending' | 'Overdue';
export type PaymentModeType = 'CASH' | 'UPI' | 'CARD' | 'BANK_TRANSFER' | 'CHEQUE';

// 1. Daily Collection Report Types
export interface DailyCollectionRecord {
  id: string;
  receiptNumber: string;
  studentName: string;
  admissionNumber: string;
  parentName: string;
  className: string;
  sectionName: string;
  amountPaid: number;
  paymentMode: PaymentModeType;
  collectedBy: string;
  collectionTime: string;
}

export interface DailyCollectionSummary {
  totalFeeCollectedToday: number;
  totalTransactions: number;
  cashCollection: number;
  onlineCollection: number;
}

// 2. Monthly Collection Report Types
export interface MonthlyCollectionRecord {
  id: string;
  receiptNumber: string;
  studentName: string;
  className: string;
  sectionName: string;
  amountPaid: number;
  paymentDate: string;
  paymentMode: PaymentModeType;
}

export interface MonthlyCollectionSummary {
  totalCollection: number;
  paidStudents: number;
  pendingStudents: number;
  totalTransactions: number;
}

// 3. Due Fee Report Types
export interface DueFeeRecord {
  id: string;
  studentName: string;
  parentName: string;
  mobileNumber: string;
  className: string;
  sectionName: string;
  totalFee: number;
  paidAmount: number;
  balanceAmount: number;
  dueDate: string;
  status: 'Pending' | 'Partial' | 'Overdue';
}

export interface DueFeeSummary {
  totalOutstandingAmount: number;
  studentsWithPendingFees: number;
  dueThisMonth: number;
  overdueStudents: number;
}

// 4. Balance Report Types
export interface BalanceRecord {
  id: string;
  studentName: string;
  admissionNumber: string;
  parentName: string;
  className: string;
  sectionName: string;
  totalFee: number;
  paidAmount: number;
  remainingBalance: number;
  lastPaymentDate: string;
}

// 5. Class Wise Fee Report Types
export interface ClassWiseFeeRecord {
  id: string;
  studentName: string;
  admissionNumber: string;
  parentName: string;
  sectionName: string;
  totalFee: number;
  paidAmount: number;
  balanceAmount: number;
  paymentStatus: 'Paid' | 'Partial' | 'Pending';
}

export interface ClassWiseFeeSummary {
  totalStudents: number;
  studentsPaid: number;
  studentsPending: number;
  totalCollection: number;
  totalBalance: number;
}

// 6. Student Fee Report Types
export interface StudentFeeReportProfile {
  studentName: string;
  admissionNumber: string;
  className: string;
  sectionName: string;
  parentName: string;
  parentMobile: string;
  totalFeeAssigned: number;
  totalPaid: number;
  balanceRemaining: number;
  latestReceiptNo: string;
  paymentHistory: {
    receiptNo: string;
    date: string;
    amount: number;
    mode: PaymentModeType;
    feeHead: string;
  }[];
}
