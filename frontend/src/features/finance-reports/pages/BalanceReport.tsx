import React, { useState, useEffect } from 'react';
import { getBalanceRecords, exportReportData } from '../services/financeReportsService';
import { ExportFormat } from '../types/financeReports.types';
import { Search, Download, Printer, FileText } from 'lucide-react';
import styles from './DailyCollectionReport.module.css';

export const BalanceReport: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [allRecords, setAllRecords] = useState(getBalanceRecords());

  useEffect(() => {
    setAllRecords(getBalanceRecords());
  }, [selectedClass]);

  const records = allRecords.filter((r) => {
    if (selectedClass !== 'ALL' && r.className !== selectedClass) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.studentName.toLowerCase().includes(q) ||
      r.admissionNumber.toLowerCase().includes(q) ||
      r.parentName.toLowerCase().includes(q)
    );
  });

  const handleExport = (format: ExportFormat) => {
    const headers = ['Student Name', 'Admission No', 'Parent Name', 'Class', 'Section', 'Total Fee', 'Paid Amount', 'Remaining Balance', 'Last Payment Date'];
    const rows = records.map((r) => [
      r.studentName, r.admissionNumber, r.parentName, r.className, r.sectionName, r.totalFee, r.paidAmount, r.remainingBalance, r.lastPaymentDate
    ]);
    exportReportData('Student_Fee_Balance_Report', headers, rows, format);
  };

  return (
    <div className={styles.container}>
      {/* TOOLBAR */}
      <div className={styles.toolbarCard}>
        <div className={styles.leftToolbar}>
          <div className={styles.searchBox}>
            <Search size={15} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search Student, Admission No, Parent..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className={styles.dateInput}
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="ALL">All Classes</option>
            <option value="Class 5">Class 5</option>
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

      {/* TABLE */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Admission No</th>
              <th>Parent Name</th>
              <th>Class</th>
              <th>Sec</th>
              <th>Total Fee</th>
              <th>Paid Amount</th>
              <th>Remaining Balance</th>
              <th>Last Payment Date</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} className={styles.row}>
                <td><strong>{r.studentName}</strong></td>
                <td><code className={styles.receiptCode}>{r.admissionNumber}</code></td>
                <td>{r.parentName}</td>
                <td>{r.className}</td>
                <td><strong>{r.sectionName}</strong></td>
                <td>₹{r.totalFee.toLocaleString('en-IN')}</td>
                <td><span className={styles.amtText}>₹{r.paidAmount.toLocaleString('en-IN')}</span></td>
                <td>
                  <strong style={{ color: r.remainingBalance > 0 ? '#dc2626' : '#16a34a' }}>
                    ₹{r.remainingBalance.toLocaleString('en-IN')}
                  </strong>
                </td>
                <td><span className={styles.timeText}>{r.lastPaymentDate}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
