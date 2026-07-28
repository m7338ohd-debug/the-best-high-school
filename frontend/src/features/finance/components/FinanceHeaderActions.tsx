import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  Receipt, 
  RefreshCw, 
  CreditCard, 
  Target, 
  Search, 
  Building2, 
  FileText, 
  Sparkles
} from 'lucide-react';
import styles from './FinanceHeaderActions.module.css';

interface FinanceHeaderActionsProps {
  onOpenSearch: () => void;
  onOpenReports: () => void;
  onOpenCashClosing?: () => void;
}

export const FinanceHeaderActions: React.FC<FinanceHeaderActionsProps> = ({
  onOpenSearch,
  onOpenReports,
  onOpenCashClosing,
}) => {
  const kpiData = [
    { title: "Today's Collection", val: '₹1,42,500', sub: '+12.4% vs yesterday', icon: <DollarSign size={20} />, color: 'emerald' },
    { title: 'Monthly Collection', val: '₹18,45,000', sub: '92.5% of Monthly Target', icon: <TrendingUp size={20} />, color: 'blue' },
    { title: 'Outstanding Balance', val: '₹4,20,000', sub: '38 Defaulter Accounts', icon: <AlertCircle size={20} />, color: 'purple' },
    { title: 'Total Defaulters', val: '38 Students', sub: '₹1.15L Overdue >60 days', icon: <AlertCircle size={20} />, color: 'red' },
    { title: 'Pending Receipts', val: '14 Receipts', sub: 'Awaiting Bank Clearance', icon: <Receipt size={20} />, color: 'amber' },
    { title: 'Refunds Processed', val: '₹12,500', sub: '2 Security Deposits', icon: <RefreshCw size={20} />, color: 'pink' },
    { title: "Today's Transactions", val: '42 Counter Payments', sub: 'Average ₹3,392/receipt', icon: <CreditCard size={20} />, color: 'cyan' },
    { title: 'Collection Target %', val: '88.4%', sub: 'Target ₹22.0L Term 2', icon: <Target size={20} />, color: 'indigo' },
  ];

  return (
    <div className={styles.container}>
      {/* PAGE TITLE & ACCOUNTANT QUICK ACTIONS */}
      <div className={styles.topRow}>
        <div>
          <span className={styles.badgePurple}>
            <Sparkles size={14} /> Accountant Fee Collection & Financial Engine
          </span>
          <h1 className={styles.title}>Accountant Fee Collection Terminal</h1>
          <p className={styles.subtitle}>Rapid student search, double-entry ledger collection, instant receipt generation & daily cash closing</p>
        </div>

        {/* ACCOUNTANT QUICK ACTIONS BAR */}
        <div className={styles.quickActionsBar}>
          <button className={styles.priActionBtn} onClick={onOpenSearch}>
            <Search size={16} />
            <span>Search Student (Ctrl+S)</span>
          </button>
          <button className={styles.actionBtn} onClick={onOpenSearch}>
            <DollarSign size={15} />
            <span>Collect Fee</span>
          </button>
          <button className={styles.actionBtn} onClick={onOpenReports}>
            <Receipt size={15} />
            <span>Receipt Register</span>
          </button>
          <button className={styles.actionBtn} onClick={onOpenCashClosing}>
            <Building2 size={15} />
            <span>Daily Cash Closing</span>
          </button>
          <button className={styles.actionBtn} onClick={onOpenReports}>
            <FileText size={15} />
            <span>Financial Reports</span>
          </button>
        </div>
      </div>

      {/* 8 TOP KPI CARDS GRID */}
      <div className={styles.kpiGrid}>
        {kpiData.map((kpi, idx) => (
          <div key={idx} className={`${styles.kpiCard} ${styles[kpi.color]}`}>
            <div className={styles.kpiTop}>
              <div className={styles.iconWrapper}>{kpi.icon}</div>
              <span className={styles.kpiVal}>{kpi.val}</span>
            </div>
            <div className={styles.kpiBottom}>
              <strong className={styles.kpiTitle}>{kpi.title}</strong>
              <span className={styles.kpiSub}>{kpi.sub}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
