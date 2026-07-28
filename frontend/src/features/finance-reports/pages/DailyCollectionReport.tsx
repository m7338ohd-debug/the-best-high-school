import React, { useState, useEffect } from 'react';
import { 
  getDailyCollectionSummary, 
  getDailyCollectionRecords, 
  exportReportData 
} from '../services/financeReportsService';
import { ExportFormat } from '../types/financeReports.types';
import { 
  DollarSign, 
  CreditCard, 
  Wallet, 
  TrendingUp, 
  Search, 
  Download, 
  Printer, 
  FileText, 
  Calendar 
} from 'lucide-react';
import styles from './DailyCollectionReport.module.css';

export const DailyCollectionReport: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const [summary, setSummary] = useState(getDailyCollectionSummary());
  const [allRecords, setAllRecords] = useState(getDailyCollectionRecords());

  useEffect(() => {
    setSummary(getDailyCollectionSummary());
    setAllRecords(getDailyCollectionRecords());
  }, [selectedDate]);

  const records = allRecords.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.studentName.toLowerCase().includes(q) ||
      r.receiptNumber.toLowerCase().includes(q) ||
      r.admissionNumber.toLowerCase().includes(q) ||
      r.parentName.toLowerCase().includes(q)
    );
  });

  const handleExport = (format: ExportFormat) => {
    const headers = ['Receipt No', 'Student Name', 'Admission No', 'Parent Name', 'Class', 'Section', 'Amount Paid', 'Mode', 'Collected By', 'Time'];
    const rows = records.map((r) => [
      r.receiptNumber, r.studentName, r.admissionNumber, r.parentName, r.className, r.sectionName, r.amountPaid, r.paymentMode, r.collectedBy, r.collectionTime
    ]);
    exportReportData('Daily_Collection_Report', headers, rows, format);
  };

  return (
    <div className={styles.container}>
      {/* 1. SUMMARY STAT CARDS */}
      <div className={styles.statGrid}>
        <div className={styles.statCard}>
          <div className={styles.iconPurple}><DollarSign size={20} /></div>
          <div>
            <span className={styles.statLabel}>Total Collected Today</span>
            <strong className={styles.statVal}>₹{summary.totalFeeCollectedToday.toLocaleString('en-IN')}</strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.iconBlue}><TrendingUp size={20} /></div>
          <div>
            <span className={styles.statLabel}>Total Transactions</span>
            <strong className={styles.statVal}>{summary.totalTransactions} Receipts</strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.iconGreen}><Wallet size={20} /></div>
          <div>
            <span className={styles.statLabel}>Counter Cash Collection</span>
            <strong className={styles.statVal}>₹{summary.cashCollection.toLocaleString('en-IN')}</strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.iconAmber}><CreditCard size={20} /></div>
          <div>
            <span className={styles.statLabel}>Online (UPI/Card/Bank)</span>
            <strong className={styles.statVal}>₹{summary.onlineCollection.toLocaleString('en-IN')}</strong>
          </div>
        </div>
      </div>

      {/* 2. FILTER & EXPORT TOOLBAR */}
      <div className={styles.toolbarCard}>
        <div className={styles.leftToolbar}>
          <div className={styles.datePickerBox}>
            <Calendar size={15} className={styles.dateIcon} />
            <input
              type="date"
              className={styles.dateInput}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className={styles.searchBox}>
            <Search size={15} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search Student, Receipt, Admission No..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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
              <th>Admission No</th>
              <th>Parent Name</th>
              <th>Class</th>
              <th>Sec</th>
              <th>Amount Paid</th>
              <th>Payment Mode</th>
              <th>Collected By</th>
              <th>Collection Time</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} className={styles.row}>
                <td><code className={styles.receiptCode}>{r.receiptNumber}</code></td>
                <td><strong>{r.studentName}</strong></td>
                <td><span className={styles.admBadge}>{r.admissionNumber}</span></td>
                <td>{r.parentName}</td>
                <td>{r.className}</td>
                <td><strong>{r.sectionName}</strong></td>
                <td><strong className={styles.amtText}>₹{r.amountPaid.toLocaleString('en-IN')}</strong></td>
                <td>
                  <span className={`${styles.modeBadge} ${styles[r.paymentMode]}`}>{r.paymentMode}</span>
                </td>
                <td>{r.collectedBy}</td>
                <td><span className={styles.timeText}>{r.collectionTime}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
