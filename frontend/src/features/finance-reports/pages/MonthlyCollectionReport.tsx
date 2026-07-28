import React, { useState, useEffect } from 'react';
import { 
  getMonthlyCollectionSummary, 
  getMonthlyCollectionRecords, 
  exportReportData 
} from '../services/financeReportsService';
import { ExportFormat } from '../types/financeReports.types';
import { 
  TrendingUp, 
  Users, 
  AlertCircle, 
  Receipt, 
  Download, 
  Printer, 
  FileText 
} from 'lucide-react';
import styles from './DailyCollectionReport.module.css';

export const MonthlyCollectionReport: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('July');
  const [selectedYear, setSelectedYear] = useState('2026-2027');
  const [selectedClass, setSelectedClass] = useState('ALL');

  const [summary, setSummary] = useState(getMonthlyCollectionSummary());
  const [allRecords, setAllRecords] = useState(getMonthlyCollectionRecords());

  useEffect(() => {
    setSummary(getMonthlyCollectionSummary());
    setAllRecords(getMonthlyCollectionRecords());
  }, [selectedMonth, selectedYear]);

  const records = allRecords.filter((r) => {
    if (selectedClass !== 'ALL' && r.className !== selectedClass) return false;
    return true;
  });

  const handleExport = (format: ExportFormat) => {
    const headers = ['Receipt No', 'Student Name', 'Class', 'Section', 'Amount Paid', 'Payment Date', 'Payment Mode'];
    const rows = records.map((r) => [
      r.receiptNumber, r.studentName, r.className, r.sectionName, r.amountPaid, r.paymentDate, r.paymentMode
    ]);
    exportReportData(`Monthly_Collection_Report_${selectedMonth}_${selectedYear}`, headers, rows, format);
  };

  return (
    <div className={styles.container}>
      {/* 1. SUMMARY STAT CARDS */}
      <div className={styles.statGrid}>
        <div className={styles.statCard}>
          <div className={styles.iconPurple}><TrendingUp size={20} /></div>
          <div>
            <span className={styles.statLabel}>Total Collection ({selectedMonth})</span>
            <strong className={styles.statVal}>₹{summary.totalCollection.toLocaleString('en-IN')}</strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.iconGreen}><Users size={20} /></div>
          <div>
            <span className={styles.statLabel}>Paid Students</span>
            <strong className={styles.statVal}>{summary.paidStudents} Students</strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.iconAmber}><AlertCircle size={20} /></div>
          <div>
            <span className={styles.statLabel}>Pending Students</span>
            <strong className={styles.statVal}>{summary.pendingStudents} Defaulters</strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.iconBlue}><Receipt size={20} /></div>
          <div>
            <span className={styles.statLabel}>Total Transactions</span>
            <strong className={styles.statVal}>{summary.totalTransactions} Receipts</strong>
          </div>
        </div>
      </div>

      {/* 2. FILTER & EXPORT TOOLBAR */}
      <div className={styles.toolbarCard}>
        <div className={styles.leftToolbar}>
          <select
            className={styles.dateInput}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <select
            className={styles.dateInput}
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="2026-2027">Session 2026-2027</option>
            <option value="2025-2026">Session 2025-2026</option>
          </select>

          <select
            className={styles.dateInput}
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="ALL">All Classes</option>
            <option value="LKG">LKG</option>
            <option value="UKG">UKG</option>
            <option value="Class 1">Class 1</option>
            <option value="Class 2">Class 2</option>
            <option value="Class 5">Class 5</option>
            <option value="Grade 8">Grade 8</option>
            <option value="Grade 10">Grade 10</option>
          </select>
        </div>

        <div className={styles.exportBtns}>
          <button className={styles.expBtn} onClick={() => handleExport('PDF')}><FileText size={14} /> PDF</button>
          <button className={styles.expBtn} onClick={() => handleExport('EXCEL')}><Download size={14} /> Excel</button>
          <button className={styles.expBtn} onClick={() => handleExport('CSV')}><Download size={14} /> CSV</button>
          <button className={styles.expBtnPrimary} onClick={() => handleExport('PRINT')}><Printer size={14} /> Print</button>
        </div>
      </div>

      {/* 3. DATATABLE */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Receipt Number</th>
              <th>Student Name</th>
              <th>Class</th>
              <th>Section</th>
              <th>Amount Paid</th>
              <th>Payment Date</th>
              <th>Payment Mode</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} className={styles.row}>
                <td><code className={styles.receiptCode}>{r.receiptNumber}</code></td>
                <td><strong>{r.studentName}</strong></td>
                <td>{r.className}</td>
                <td><strong>{r.sectionName}</strong></td>
                <td><strong className={styles.amtText}>₹{r.amountPaid.toLocaleString('en-IN')}</strong></td>
                <td><span className={styles.timeText}>{r.paymentDate}</span></td>
                <td>
                  <span className={`${styles.modeBadge} ${styles[r.paymentMode]}`}>{r.paymentMode}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
