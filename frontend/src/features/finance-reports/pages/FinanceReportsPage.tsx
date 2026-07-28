import React, { useState } from 'react';
import { DailyCollectionReport } from './DailyCollectionReport';
import { MonthlyCollectionReport } from './MonthlyCollectionReport';
import { DueFeeReport } from './DueFeeReport';
import { BalanceReport } from './BalanceReport';
import { ClassWiseReport } from './ClassWiseReport';
import { StudentFeeReport } from './StudentFeeReport';

import { 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  Scale, 
  GraduationCap, 
  UserSearch, 
  Sparkles 
} from 'lucide-react';
import styles from './FinanceReportsPage.module.css';

type ReportTab = 'daily' | 'monthly' | 'due' | 'balance' | 'class-wise' | 'student';

export const FinanceReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ReportTab>('daily');

  const navItems: { id: ReportTab; label: string; icon: React.ReactNode }[] = [
    { id: 'daily', label: 'Daily Collection', icon: <Calendar size={16} /> },
    { id: 'monthly', label: 'Monthly Collection', icon: <TrendingUp size={16} /> },
    { id: 'due', label: 'Due Fees', icon: <AlertTriangle size={16} /> },
    { id: 'balance', label: 'Balance Report', icon: <Scale size={16} /> },
    { id: 'class-wise', label: 'Class Wise Report', icon: <GraduationCap size={16} /> },
    { id: 'student', label: 'Student Report', icon: <UserSearch size={16} /> },
  ];

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <header className={styles.header}>
        <div>
          <span className={styles.badgePurple}>
            <Sparkles size={14} /> School Accountant & Administrator Finance Center
          </span>
          <h1 className={styles.title}>School Finance Reports Center</h1>
          <p className={styles.subtitle}>
            Lightweight operational fee monitoring, collection registers, pending balance tracking & class payment statements
          </p>
        </div>
      </header>

      {/* TOP NAVIGATION TABS */}
      <div className={styles.topNav}>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`${styles.navBtn} ${isActive ? styles.navActive : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* ACTIVE REPORT CONTENT */}
      <div className={styles.reportContent}>
        {activeTab === 'daily' && <DailyCollectionReport />}
        {activeTab === 'monthly' && <MonthlyCollectionReport />}
        {activeTab === 'due' && <DueFeeReport />}
        {activeTab === 'balance' && <BalanceReport />}
        {activeTab === 'class-wise' && <ClassWiseReport />}
        {activeTab === 'student' && <StudentFeeReport />}
      </div>
    </div>
  );
};
