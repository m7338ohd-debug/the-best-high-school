import React from 'react';
import { DollarSign, Calendar, TrendingUp, Users, Sparkles } from 'lucide-react';
import styles from './FourKpiDashboardHeader.module.css';

interface FourKpiDashboardHeaderProps {
  todayCollection: number;
  monthlyCollection: number;
  yearlyCollection: number;
  studentsCollectedToday: number;
}

export const FourKpiDashboardHeader: React.FC<FourKpiDashboardHeaderProps> = ({
  todayCollection,
  monthlyCollection,
  yearlyCollection,
  studentsCollectedToday,
}) => {
  return (
    <div className={styles.container}>
      {/* HEADER TITLE */}
      <div className={styles.headerTitleRow}>
        <div>
          <span className={styles.badgePurple}>
            <Sparkles size={14} /> Enterprise Accountant Collection Terminal
          </span>
          <h1 className={styles.title}>Accountant Fee Collection Terminal</h1>
          <p className={styles.subtitle}>
            Rapid student search, dynamic fee collection, automatic parent notification & double-entry receipts
          </p>
        </div>
      </div>

      {/* ONLY 4 KPI CARDS */}
      <div className={styles.kpiGrid}>
        {/* Card 1: Today's Collection */}
        <div className={`${styles.kpiCard} ${styles.emerald}`}>
          <div className={styles.kpiTop}>
            <div className={styles.iconNode}><DollarSign size={22} /></div>
            <span className={styles.kpiVal}>₹{todayCollection.toLocaleString('en-IN')}</span>
          </div>
          <div className={styles.kpiBottom}>
            <strong className={styles.kpiTitle}>Today's Collection</strong>
            <span className={styles.kpiSub}>Live counter receipts collected today</span>
          </div>
        </div>

        {/* Card 2: Monthly Collection */}
        <div className={`${styles.kpiCard} ${styles.purple}`}>
          <div className={styles.kpiTop}>
            <div className={styles.iconNode}><Calendar size={22} /></div>
            <span className={styles.kpiVal}>₹{monthlyCollection.toLocaleString('en-IN')}</span>
          </div>
          <div className={styles.kpiBottom}>
            <strong className={styles.kpiTitle}>Monthly Collection</strong>
            <span className={styles.kpiSub}>Current month revenue accumulation</span>
          </div>
        </div>

        {/* Card 3: Yearly Collection */}
        <div className={`${styles.kpiCard} ${styles.blue}`}>
          <div className={styles.kpiTop}>
            <div className={styles.iconNode}><TrendingUp size={22} /></div>
            <span className={styles.kpiVal}>₹{yearlyCollection.toLocaleString('en-IN')}</span>
          </div>
          <div className={styles.kpiBottom}>
            <strong className={styles.kpiTitle}>Yearly Collection</strong>
            <span className={styles.kpiSub}>Academic Session 2026-2027 total</span>
          </div>
        </div>

        {/* Card 4: Students Collected Today */}
        <div className={`${styles.kpiCard} ${styles.indigo}`}>
          <div className={styles.kpiTop}>
            <div className={styles.iconNode}><Users size={22} /></div>
            <span className={styles.kpiVal}>{studentsCollectedToday}</span>
          </div>
          <div className={styles.kpiBottom}>
            <strong className={styles.kpiTitle}>Students Collected Today</strong>
            <span className={styles.kpiSub}>Counter student receipts issued</span>
          </div>
        </div>
      </div>
    </div>
  );
};
