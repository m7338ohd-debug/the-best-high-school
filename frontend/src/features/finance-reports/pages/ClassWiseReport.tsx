import React, { useState } from 'react';
import { getClassWiseSummary, getClassWiseRecords, exportReportData } from '../services/financeReportsService';
import { ExportFormat, ClassWiseFeeRecord } from '../types/financeReports.types';
import { 
  GraduationCap, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  DollarSign, 
  Search, 
  Download, 
  Printer, 
  FileText 
} from 'lucide-react';
import styles from './ClassWiseReport.module.css';

export const ClassWiseReport: React.FC = () => {
  const [activeClass, setActiveClass] = useState('Class 5');
  const [selectedSection, setSelectedSection] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const classList = ['ALL', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'];

  const classSummary = getClassWiseSummary(activeClass);
  const classRecords = getClassWiseRecords(activeClass);

  const records = classRecords.filter((r: ClassWiseFeeRecord) => {
    if (selectedSection !== 'ALL' && r.sectionName !== selectedSection) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.studentName.toLowerCase().includes(q) ||
      r.admissionNumber.toLowerCase().includes(q) ||
      r.parentName.toLowerCase().includes(q)
    );
  });

  const handleExport = (format: ExportFormat) => {
    const headers = ['Student Name', 'Admission No', 'Parent Name', 'Section', 'Total Fee', 'Paid Amount', 'Balance', 'Status'];
    const rows = records.map((r: ClassWiseFeeRecord) => [
      r.studentName, r.admissionNumber, r.parentName, r.sectionName, r.totalFee, r.paidAmount, r.balanceAmount, r.paymentStatus
    ]);
    exportReportData(`${activeClass}_Fee_Collection_Report`, headers, rows, format);
  };

  return (
    <div className={styles.container}>
      {/* CLASS SELECTOR TABS */}
      <div className={styles.classTabsHeader}>
        <span className={styles.tabTitle}><GraduationCap size={16} /> Select Class:</span>
        <div className={styles.classTabsGrid}>
          {classList.map((cls) => (
            <button
              key={cls}
              className={`${styles.classTabBtn} ${activeClass === cls ? styles.classTabActive : ''}`}
              onClick={() => setActiveClass(cls)}
            >
              {cls}
            </button>
          ))}
        </div>
      </div>

      {/* 1. SUMMARY STAT CARDS */}
      <div className={styles.statGrid}>
        <div className={styles.statCard}>
          <div className={styles.iconPurple}><Users size={20} /></div>
          <div>
            <span className={styles.statLabel}>Total {activeClass} Students</span>
            <strong className={styles.statVal}>{classSummary.totalStudents}</strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.iconGreen}><CheckCircle2 size={20} /></div>
          <div>
            <span className={styles.statLabel}>Students Paid</span>
            <strong className={styles.statVal}>{classSummary.studentsPaid}</strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.iconRed}><AlertCircle size={20} /></div>
          <div>
            <span className={styles.statLabel}>Students Pending</span>
            <strong className={styles.statVal}>{classSummary.studentsPending}</strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.iconBlue}><DollarSign size={20} /></div>
          <div>
            <span className={styles.statLabel}>Total Collected</span>
            <strong className={styles.statVal}>₹{classSummary.totalCollection.toLocaleString('en-IN')}</strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.iconAmber}><DollarSign size={20} /></div>
          <div>
            <span className={styles.statLabel}>Total Outstanding Balance</span>
            <strong className={styles.statVal}>₹{classSummary.totalBalance.toLocaleString('en-IN')}</strong>
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
              placeholder={`Search ${activeClass} Student...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className={styles.dateInput}
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
          >
            <option value="ALL">All Sections</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
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
              <th>Admission No</th>
              <th>Parent Name</th>
              <th>Section</th>
              <th>Total Fee</th>
              <th>Paid Amount</th>
              <th>Balance Amount</th>
              <th>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r: ClassWiseFeeRecord) => (
              <tr key={r.id} className={styles.row}>
                <td><strong>{r.studentName}</strong></td>
                <td><code className={styles.receiptCode}>{r.admissionNumber}</code></td>
                <td>{r.parentName}</td>
                <td><strong>{r.sectionName}</strong></td>
                <td>₹{r.totalFee.toLocaleString('en-IN')}</td>
                <td><span className={styles.amtText}>₹{r.paidAmount.toLocaleString('en-IN')}</span></td>
                <td>
                  <strong style={{ color: r.balanceAmount > 0 ? '#dc2626' : '#16a34a' }}>
                    ₹{r.balanceAmount.toLocaleString('en-IN')}
                  </strong>
                </td>
                <td>
                  <span className={`${styles.statusBadge} ${
                    r.paymentStatus === 'Paid' ? styles.statusPaid :
                    r.paymentStatus === 'Partial' ? styles.statusPartial : styles.statusPending
                  }`}>
                    {r.paymentStatus}
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
