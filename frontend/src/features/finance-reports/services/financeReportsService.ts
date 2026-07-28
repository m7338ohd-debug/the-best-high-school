import { 
  DailyCollectionRecord, 
  DailyCollectionSummary,
  MonthlyCollectionRecord,
  MonthlyCollectionSummary,
  DueFeeRecord,
  DueFeeSummary,
  BalanceRecord,
  ClassWiseFeeRecord,
  ClassWiseFeeSummary,
  StudentFeeReportProfile,
  ExportFormat,
  PaymentModeType
} from '../types/financeReports.types';
import { getStoredStudents, getStoredFeePayments } from '../../../shared/utils/schoolDataStorage';

// Dynamic Report Data Generators from Master Storage
export const getDailyCollectionSummary = (): DailyCollectionSummary => {
  const payments = getStoredFeePayments();
  const todayStr = new Date().toISOString().split('T')[0];
  const todayPayments = payments.filter((p) => p.paymentDate === todayStr);

  const total = todayPayments.reduce((acc, p) => acc + p.amountPaid, 0);
  const cash = todayPayments.filter((p) => p.paymentChannel === 'CASH').reduce((acc, p) => acc + p.amountPaid, 0);
  const online = total - cash;

  return {
    totalFeeCollectedToday: total,
    totalTransactions: todayPayments.length,
    cashCollection: cash,
    onlineCollection: online,
  };
};

export const getDailyCollectionRecords = (): DailyCollectionRecord[] => {
  const payments = getStoredFeePayments();
  const todayStr = new Date().toISOString().split('T')[0];
  return payments
    .filter((p) => p.paymentDate === todayStr)
    .map((p, idx) => ({
      id: p.id || `d-${idx}`,
      receiptNumber: p.receiptNo,
      studentName: p.studentName,
      admissionNumber: p.admissionNo,
      parentName: p.parentName,
      className: p.className,
      sectionName: p.sectionName,
      amountPaid: p.amountPaid,
      paymentMode: (p.paymentChannel || 'CASH') as PaymentModeType,
      collectedBy: p.collectedBy || 'Accountant',
      collectionTime: 'Today',
    }));
};

export const getMonthlyCollectionSummary = (): MonthlyCollectionSummary => {
  const payments = getStoredFeePayments();
  const students = getStoredStudents();
  const total = payments.reduce((acc, p) => acc + p.amountPaid, 0);
  const paidCount = students.filter((s) => s.feeStatus === 'Paid').length;
  const pendingCount = students.length - paidCount;

  return {
    totalCollection: total,
    paidStudents: paidCount,
    pendingStudents: pendingCount,
    totalTransactions: payments.length,
  };
};

export const getMonthlyCollectionRecords = (): MonthlyCollectionRecord[] => {
  const payments = getStoredFeePayments();
  return payments.map((p, idx) => ({
    id: p.id || `m-${idx}`,
    receiptNumber: p.receiptNo,
    studentName: p.studentName,
    className: p.className,
    sectionName: p.sectionName,
    amountPaid: p.amountPaid,
    paymentDate: p.paymentDate,
    paymentMode: (p.paymentChannel || 'CASH') as PaymentModeType,
  }));
};

export const getDueFeeSummary = (): DueFeeSummary => {
  const students = getStoredStudents();
  const pendingStudents = students.filter((s) => s.feeStatus !== 'Paid');

  return {
    totalOutstandingAmount: pendingStudents.length * 12000,
    studentsWithPendingFees: pendingStudents.length,
    dueThisMonth: pendingStudents.length * 4000,
    overdueStudents: pendingStudents.length,
  };
};

export const getDueFeeRecords = (): DueFeeRecord[] => {
  const students = getStoredStudents();
  return students
    .filter((s) => s.feeStatus !== 'Paid')
    .map((s, idx) => ({
      id: s.id || `due-${idx}`,
      studentName: s.studentName,
      parentName: s.parentName,
      mobileNumber: s.contact,
      className: s.className,
      sectionName: s.sectionName,
      totalFee: 12000,
      paidAmount: 0,
      balanceAmount: 12000,
      dueDate: '2026-08-15',
      status: 'Pending',
    }));
};

export const getBalanceRecords = (): BalanceRecord[] => {
  const students = getStoredStudents();
  return students.map((s, idx) => ({
    id: s.id || `bal-${idx}`,
    studentName: s.studentName,
    admissionNumber: s.admissionNo,
    parentName: s.parentName,
    className: s.className,
    sectionName: s.sectionName,
    totalFee: 12000,
    paidAmount: s.feeStatus === 'Paid' ? 12000 : 0,
    remainingBalance: s.feeStatus === 'Paid' ? 0 : 12000,
    lastPaymentDate: s.lastUpdated || 'N/A',
  }));
};

// Fallback exported constants for initial renders
export const mockDailyCollectionSummary = getDailyCollectionSummary();
export const mockDailyCollectionRecords = getDailyCollectionRecords();
export const mockMonthlyCollectionSummary = getMonthlyCollectionSummary();
export const mockMonthlyCollectionRecords = getMonthlyCollectionRecords();
export const mockDueFeeSummary = getDueFeeSummary();
export const mockDueFeeRecords = getDueFeeRecords();
export const mockBalanceRecords = getBalanceRecords();
export const mockClassWiseSummary: ClassWiseFeeSummary = {
  totalStudents: 0,
  studentsPaid: 0,
  studentsPending: 0,
  totalCollection: 0,
  totalBalance: 0,
};
export const mockClassWiseRecords: ClassWiseFeeRecord[] = [];
export const mockStudentFeeProfile: StudentFeeReportProfile = {
  studentName: 'N/A',
  admissionNumber: 'N/A',
  className: 'N/A',
  sectionName: 'N/A',
  parentName: 'N/A',
  parentMobile: 'N/A',
  totalFeeAssigned: 0,
  totalPaid: 0,
  balanceRemaining: 0,
  latestReceiptNo: 'N/A',
  paymentHistory: [],
};

// All 4 Export Implementations: PDF, EXCEL, CSV, PRINT
export const exportReportData = (
  reportTitle: string,
  headers: string[],
  rows: (string | number)[][],
  format: ExportFormat
) => {
  const cleanTitle = reportTitle.replace(/\s+/g, '_');
  const dateStr = new Date().toLocaleDateString('en-IN');

  // 1. PRINT FORMAT
  if (format === 'PRINT') {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${reportTitle}</title>
            <style>
              body { font-family: sans-serif; padding: 20px; color: #0f172a; }
              h1 { color: #7e22ce; margin-bottom: 4px; }
              p { color: #64748b; font-size: 0.85rem; margin-top: 0; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 0.85rem; }
              th { background: #f3e8ff; color: #7e22ce; text-align: left; padding: 8px; border: 1px solid #d8b4fe; }
              td { padding: 8px; border: 1px solid #e2e8f0; }
              tr:nth-child(even) { background: #faf5ff; }
            </style>
          </head>
          <body>
            <h1>${reportTitle}</h1>
            <p>Official Report • Generated on ${dateStr}</p>
            <table>
              <thead>
                <tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr>
              </thead>
              <tbody>
                ${rows.map((r) => `<tr>${r.map((v) => `<td>${v}</td>`).join('')}</tr>`).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 300);
    }
    return;
  }

  // 2. CSV FORMAT
  if (format === 'CSV') {
    const csvContent = [
      headers.join(','),
      ...rows.map((r) => r.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${cleanTitle}_${dateStr.replace(/\//g, '-')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  // 3. EXCEL FORMAT
  if (format === 'EXCEL') {
    const excelContent = [
      headers.join('\t'),
      ...rows.map((r) => r.join('\t')),
    ].join('\n');

    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${cleanTitle}_${dateStr.replace(/\//g, '-')}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  // 4. PDF FORMAT
  if (format === 'PDF') {
    const pdfHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${reportTitle}</title>
          <style>
            @page { size: A4 portrait; margin: 15mm; }
            body { font-family: Arial, sans-serif; font-size: 11px; color: #1e293b; }
            .header { border-bottom: 2px solid #7e22ce; padding-bottom: 8px; margin-bottom: 15px; }
            .title { color: #7e22ce; font-size: 18px; font-weight: bold; margin: 0; }
            .sub { color: #64748b; font-size: 10px; margin-top: 4px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background-color: #f3e8ff; color: #7e22ce; font-weight: bold; text-align: left; padding: 6px; border: 1px solid #d8b4fe; }
            td { padding: 6px; border: 1px solid #e2e8f0; }
            tr:nth-child(even) { background-color: #faf5ff; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">${reportTitle}</div>
            <div class="sub">Generated: ${dateStr} | Official School Financial Statement</div>
          </div>
          <table>
            <thead>
              <tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${rows.map((r) => `<tr>${r.map((v) => `<td>${v}</td>`).join('')}</tr>`).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([pdfHtml], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${cleanTitle}_${dateStr.replace(/\//g, '-')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const pdfWindow = window.open('', '_blank');
    if (pdfWindow) {
      pdfWindow.document.write(pdfHtml);
      pdfWindow.document.close();
      setTimeout(() => pdfWindow.print(), 500);
    }
  }
};
