import React, { useState, useEffect } from 'react';
import { 
  getDueFeeSummary, 
  getDueFeeRecords, 
  exportReportData 
} from '../services/financeReportsService';
import { ExportFormat } from '../types/financeReports.types';
import { 
  AlertTriangle, 
  Users, 
  Clock, 
  Search, 
  Download, 
  Printer, 
  FileText 
} from 'lucide-react';
import styles from './DailyCollectionReport.module.css';

export const DueFeeReport: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [summary, setSummary] = useState(getDueFeeSummary());
  const [allRecords, setAllRecords] = useState(getDueFeeRecords());

  useEffect(() => {
    setSummary(getDueFeeSummary());
    setAllRecords(getDueFeeRecords());
  }, [selectedClass]);

  const records = allRecords.filter((r) => {
    if (selectedClass !== 'ALL' && r.className !== selectedClass) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.studentName.toLowerCase().includes(q) ||
      r.parentName.toLowerCase().includes(q) ||
      r.mobileNumber.toLowerCase().includes(q)
    );
  });

  const handleExport = (format: ExportFormat) => {
    const headers = ['Student Name', 'Parent Name', 'Mobile Number', 'Class', 'Section', 'Total Fee', 'Paid Amount', 'Balance Amount', 'Due Date', 'Status'];
    const rows = records.map((r) => [
      r.studentName, r.parentName, r.mobileNumber, r.className, r.sectionName, r.totalFee, r.paidAmount, r.balanceAmount, r.dueDate, r.status
    ]);
    exportReportData('Due_Fee_Defaulters_Report', headers, rows, format);
  };

  return (
    <div className={styles.container}>
      {/* 1. SUMMARY STAT CARDS */}
      <div className={styles.statGrid}>
        <div className={styles.statCard}>
          <div className={styles.iconPurple}><AlertTriangle size={20} /></div>
          <div>
            <span className={styles.statLabel}>Total Outstanding Dues</span>
            <strong className={styles.statVal}>₹{summary.totalOutstandingAmount.toLocaleString('en-IN')}</strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.iconAmber}><Users size={20} /></div>
          <div>
            <span className={styles.statLabel}>Students with Dues</span>
            <strong className={styles.statVal}>{summary.studentsWithPendingFees} Students</strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.iconBlue}><Clock size={20} /></div>
          <div>
            <span className={styles.statLabel}>Due This Month</span>
            <strong className={styles.statVal}>₹{summary.dueThisMonth.toLocaleString('en-IN')}</strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.iconGreen}><AlertTriangle size={20} /></div>
          <div>
            <span className={styles.statLabel}>Overdue Pending</span>
            <strong className={styles.statVal}>{summary.overdueStudents} Students</strong>
          </div>
        </div>
      </div>

      {/* 2. FILTER & EXPORT TOOLBAR */}
      <div className={styles.toolbarCard}>
        <div className={styles.leftToolbar}>
          <div className={styles.searchBox}>
            <Search size={15} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search Student, Parent, Mobile..."
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
            <option value="Grade 7">Grade 7</option>
            <option value="Grade 9">Grade 9</option>
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
              <th>Student Name</th>
              <th>Parent Name</th>
              <th>Mobile Number</th>
              <th>Class</th>
              <th>Section</th>
              <th>Total Fee</th>
              <th>Paid Amount</th>
              <th>Balance Amount</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} className={styles.row}>
                <td><strong>{r.studentName}</strong></td>
                <td>{r.parentName}</td>
                <td><code className={styles.receiptCode}>{r.mobileNumber}</code></td>
                <td>{r.className}</td>
                <td><strong>{r.sectionName}</strong></td>
                <td>₹{r.totalFee.toLocaleString('en-IN')}</td>
                <td><span className={styles.amtText}>₹{r.paidAmount.toLocaleString('en-IN')}</span></td>
                <td><strong style={{ color: '#dc2626' }}>₹{r.balanceAmount.toLocaleString('en-IN')}</strong></td>
                <td><span className={styles.timeText}>{r.dueDate}</span></td>
                <td>
                  <span className={`${styles.modeBadge} ${
                    r.status === 'Overdue' ? styles.CARD :
                    r.status === 'Partial' ? styles.UPI : styles.CASH
                  }`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
