import React, { useState } from 'react';
import { mockStudentFeeProfile, exportReportData } from '../services/financeReportsService';
import { ExportFormat } from '../types/financeReports.types';
import { 
  User, 
  Search, 
  Download, 
  Printer, 
  FileText, 
  History, 
  CheckCircle2 
} from 'lucide-react';
import styles from './StudentFeeReport.module.css';

export const StudentFeeReport: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('Alex Johnson');
  const profile = mockStudentFeeProfile;

  const handleExport = (format: ExportFormat) => {
    const headers = ['Receipt No', 'Payment Date', 'Amount Paid', 'Payment Mode', 'Fee Head Description'];
    const rows = profile.paymentHistory.map((p) => [
      p.receiptNo, p.date, p.amount, p.mode, p.feeHead
    ]);
    exportReportData(`Student_Fee_Report_${profile.studentName.replace(/\s+/g, '_')}`, headers, rows, format);
  };

  return (
    <div className={styles.container}>
      {/* SEARCH HEADER */}
      <div className={styles.searchCard}>
        <label className={styles.searchLabel}>Search Individual Student Fee Ledger Profile</label>
        <div className={styles.searchRow}>
          <div className={styles.searchBox}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search by Student Name, Admission No (e.g. ADM-2026-0001), or Parent Mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className={styles.searchBtn}>Search Student Ledger</button>
        </div>
      </div>

      {/* STUDENT PROFILE CARD */}
      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div className={styles.avatarBox}>
            <User size={24} />
          </div>
          <div>
            <span className={styles.admBadge}>{profile.admissionNumber}</span>
            <h2 className={styles.studentName}>{profile.studentName}</h2>
            <p className={styles.studentSub}>
              {profile.className} ({profile.sectionName}) • Parent: <strong>{profile.parentName}</strong> ({profile.parentMobile})
            </p>
          </div>

          <div className={styles.exportBtns}>
            <button className={styles.expBtn} onClick={() => handleExport('PDF')}><FileText size={14} /> PDF</button>
            <button className={styles.expBtn} onClick={() => handleExport('EXCEL')}><Download size={14} /> Excel</button>
            <button className={styles.expBtnPrimary} onClick={() => handleExport('PRINT')}><Printer size={14} /> Print Statement</button>
          </div>
        </div>

        {/* FINANCIAL SUMMARY METRICS */}
        <div className={styles.metricsGrid}>
          <div className={styles.metricBox}>
            <span className={styles.mLabel}>Total Fee Assigned</span>
            <strong className={styles.mVal}>₹{profile.totalFeeAssigned.toLocaleString('en-IN')}</strong>
          </div>

          <div className={styles.metricBox}>
            <span className={styles.mLabel}>Total Amount Paid</span>
            <strong className={styles.mValGreen}>₹{profile.totalPaid.toLocaleString('en-IN')}</strong>
          </div>

          <div className={styles.metricBox}>
            <span className={styles.mLabel}>Balance Remaining</span>
            <strong className={profile.balanceRemaining > 0 ? styles.mValRed : styles.mValGreen}>
              ₹{profile.balanceRemaining.toLocaleString('en-IN')}
            </strong>
          </div>

          <div className={styles.metricBox}>
            <span className={styles.mLabel}>Latest Counter Receipt</span>
            <code className={styles.receiptCode}>{profile.latestReceiptNo}</code>
          </div>
        </div>
      </div>

      {/* PAYMENT & RECEIPT HISTORY TABLE */}
      <div className={styles.tableCard}>
        <div className={styles.tbHeader}>
          <h3 className={styles.tbTitle}><History size={16} /> Complete Payment & Receipt History</h3>
          <span className={styles.tbSub}>Audit log of all counter payments made for {profile.studentName}</span>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Receipt Number</th>
                <th>Payment Date</th>
                <th>Fee Head Description</th>
                <th>Amount Paid</th>
                <th>Payment Channel</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {profile.paymentHistory.map((p, idx) => (
                <tr key={idx} className={styles.row}>
                  <td><code className={styles.receiptCode}>{p.receiptNo}</code></td>
                  <td>{p.date}</td>
                  <td><strong>{p.feeHead}</strong></td>
                  <td><strong className={styles.amtText}>₹{p.amount.toLocaleString('en-IN')}</strong></td>
                  <td><span className={styles.modeBadge}>{p.mode}</span></td>
                  <td><span className={styles.statusPaid}><CheckCircle2 size={12} /> CLEARED</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
