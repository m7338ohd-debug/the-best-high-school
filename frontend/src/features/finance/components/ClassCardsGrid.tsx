import React from 'react';
import { ClassSummaryCard } from '../types/finance.types';
import { GraduationCap, ArrowRight, Users } from 'lucide-react';
import styles from './ClassCardsGrid.module.css';

interface ClassCardsGridProps {
  classes: ClassSummaryCard[];
  onSelectClass: (cls: ClassSummaryCard) => void;
}

export const ClassCardsGrid: React.FC<ClassCardsGridProps> = ({
  classes,
  onSelectClass,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.sectionTitle}>School Fee Status by Class</h2>
          <p className={styles.sectionSub}>Select a class to inspect section-merged student roster & collect dues</p>
        </div>
      </div>

      {/* CLASS CARDS GRID (LKG TO GRADE 10) */}
      <div className={styles.classGrid}>
        {classes.map((cls) => {
          const isClear = cls.outstandingFees <= 0;
          return (
            <div
              key={cls.id}
              className={styles.classCard}
              onClick={() => onSelectClass(cls)}
            >
              <div className={styles.cardTop}>
                <div className={styles.classBadgeIcon}>
                  <GraduationCap size={22} />
                </div>
                <span className={`${styles.statusPill} ${isClear ? styles.statusClear : styles.statusDue}`}>
                  {isClear ? 'FULLY PAID' : `₹${cls.outstandingFees.toLocaleString('en-IN')} DUES`}
                </span>
              </div>

              <div className={styles.cardMain}>
                <h3 className={styles.className}>{cls.className}</h3>
                <span className={styles.totalStudentsCount}>
                  <Users size={13} /> {cls.totalStudents} Enrolled Students
                </span>
              </div>

              {/* STATS GRID */}
              <div className={styles.statsGrid}>
                <div className={styles.statBox}>
                  <span className={styles.statLabel}>Paid</span>
                  <strong className={styles.statValGreen}>{cls.paidStudents}</strong>
                </div>

                <div className={styles.statBox}>
                  <span className={styles.statLabel}>Pending</span>
                  <strong className={styles.statValRed}>{cls.pendingStudents}</strong>
                </div>

                <div className={styles.statBox}>
                  <span className={styles.statLabel}>Outstanding</span>
                  <strong className={styles.statValPurple}>₹{cls.outstandingFees.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <button className={styles.openClassBtn}>
                <span>Open Class Workspace</span>
                <ArrowRight size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
