import React, { useMemo } from 'react';
import { StudentRecord } from '../types/student.types';
import { 
  PieChart as PieIcon, 
  Users, 
  DollarSign
} from 'lucide-react';
import styles from './StudentAnalyticsGrid.module.css';

interface StudentAnalyticsGridProps {
  students?: StudentRecord[];
}

export const StudentAnalyticsGrid: React.FC<StudentAnalyticsGridProps> = ({ students = [] }) => {
  const total = students.length;

  // 1. Boys vs Girls Donut Data
  const genderData = useMemo(() => {
    const boys = students.filter((s) => s.gender === 'Male').length;
    const girls = students.filter((s) => s.gender === 'Female').length;
    const boysPct = total > 0 ? Math.round((boys / total) * 100) : 0;
    const girlsPct = total > 0 ? 100 - boysPct : 0;

    return {
      boys,
      girls,
      boysPct,
      girlsPct,
      donutItems: [
        { label: 'Boys', percent: boysPct, color: '#2563eb' },
        { label: 'Girls', percent: girlsPct, color: '#db2777' },
      ],
    };
  }, [students, total]);

  // 2. Student Status Pie Data
  const statusData = useMemo(() => {
    const active = students.filter((s) => s.status === 'ACTIVE').length;
    const inactive = students.filter((s) => s.status !== 'ACTIVE').length;
    const activePct = total > 0 ? Math.round((active / total) * 100) : 0;
    const inactivePct = total > 0 ? 100 - activePct : 0;

    return {
      active,
      inactive,
      activePct,
      donutItems: [
        { label: 'Active', count: active, percent: activePct, color: '#10b981' },
        { label: 'Inactive', count: inactive, percent: inactivePct, color: '#64748b' },
      ],
    };
  }, [students, total]);

  // 3. Fee Status Donut Data
  const feeStatusData = useMemo(() => {
    const paid = students.filter((s) => s.feeStatus === 'Paid').length;
    const pending = students.filter((s) => s.feeStatus !== 'Paid').length;
    const paidPct = total > 0 ? Math.round((paid / total) * 100) : 0;
    const pendingPct = total > 0 ? 100 - paidPct : 0;

    return {
      paid,
      pending,
      paidPct,
      donutItems: [
        { label: 'Paid Fees', percent: paidPct, count: paid, color: '#10b981' },
        { label: 'Pending Dues', percent: pendingPct, count: pending, color: '#ef4444' },
      ],
    };
  }, [students, total]);

  // Donut Arc Generator Helper
  const renderDonut = (items: { label: string; percent: number; color: string }[], radius = 60, strokeW = 20) => {
    if (total === 0) {
      return (
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="transparent"
          stroke="#e2e8f0"
          strokeWidth={strokeW}
        />
      );
    }

    const circumference = 2 * Math.PI * radius;
    let offset = 0;

    return items.map((item, idx) => {
      const strokeDasharray = `${(item.percent / 100) * circumference} ${circumference}`;
      const strokeDashoffset = -offset;
      offset += (item.percent / 100) * circumference;

      return (
        <circle
          key={idx}
          cx="100"
          cy="100"
          r={radius}
          fill="transparent"
          stroke={item.color}
          strokeWidth={strokeW}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className={styles.donutArc}
        />
      );
    });
  };

  return (
    <div className={styles.container}>
      {/* CHART 1: Boys vs Girls Donut Chart */}
      <div className={styles.chartCard}>
        <div className={styles.cardHeader}>
          <div>
            <div className={styles.badgeBlue}><Users size={12} /> Gender Ratio</div>
            <h3 className={styles.chartTitle}>Boys vs Girls Ratio</h3>
            <p className={styles.chartSub}>Total {total} Enrolled Students</p>
          </div>
        </div>

        <div className={styles.donutContainer}>
          <svg viewBox="0 0 200 200" className={styles.donutSvg}>
            {renderDonut(genderData.donutItems, 65, 20)}
          </svg>
          <div className={styles.donutCenter}>
            <span className={styles.donutVal}>{total}</span>
            <span className={styles.donutSub}>Students</span>
          </div>
        </div>

        <div className={styles.donutLegendGrid}>
          <div className={styles.legendCard}>
            <span className={styles.dotBlue} />
            <div>
              <strong>Boys: {genderData.boys}</strong>
              <span>{genderData.boysPct}% Ratio</span>
            </div>
          </div>
          <div className={styles.legendCard}>
            <span className={styles.dotPink} />
            <div>
              <strong>Girls: {genderData.girls}</strong>
              <span>{genderData.girlsPct}% Ratio</span>
            </div>
          </div>
        </div>
      </div>

      {/* CHART 2: Student Status Breakdown (Pie Chart) */}
      <div className={styles.chartCard}>
        <div className={styles.cardHeader}>
          <div>
            <div className={styles.badgeEmerald}><PieIcon size={12} /> Active vs Inactive</div>
            <h3 className={styles.chartTitle}>Student Status Distribution</h3>
            <p className={styles.chartSub}>Enrollment Status Breakdown</p>
          </div>
        </div>

        <div className={styles.donutContainer}>
          <svg viewBox="0 0 200 200" className={styles.donutSvg}>
            {renderDonut(statusData.donutItems, 60, 24)}
          </svg>
          <div className={styles.donutCenter}>
            <span className={styles.donutVal}>{statusData.activePct}%</span>
            <span className={styles.donutSub}>Active</span>
          </div>
        </div>

        <div className={styles.statusLegendGrid}>
          {statusData.donutItems.map((item, idx) => (
            <div key={idx} className={styles.statusRow}>
              <div className={styles.statusLabel}>
                <span className={styles.colorDot} style={{ background: item.color }} />
                <span>{item.label}</span>
              </div>
              <strong className={styles.statusCount}>{item.count} ({item.percent}%)</strong>
            </div>
          ))}
        </div>
      </div>

      {/* CHART 3: Fee Status Distribution (Donut Chart) */}
      <div className={styles.chartCard}>
        <div className={styles.cardHeader}>
          <div>
            <div className={styles.badgeAmber}><DollarSign size={12} /> Revenue Status</div>
            <h3 className={styles.chartTitle}>Fee Status Breakdown</h3>
            <p className={styles.chartSub}>Paid vs Pending Dues Ledger</p>
          </div>
        </div>

        <div className={styles.donutContainer}>
          <svg viewBox="0 0 200 200" className={styles.donutSvg}>
            {renderDonut(feeStatusData.donutItems, 60, 22)}
          </svg>
          <div className={styles.donutCenter}>
            <span className={styles.donutVal}>{feeStatusData.paidPct}%</span>
            <span className={styles.donutSub}>Paid</span>
          </div>
        </div>

        <div className={styles.statusLegendGrid}>
          {feeStatusData.donutItems.map((item, idx) => (
            <div key={idx} className={styles.statusRow}>
              <div className={styles.statusLabel}>
                <span className={styles.colorDot} style={{ background: item.color }} />
                <span>{item.label}</span>
              </div>
              <strong className={styles.statusCount}>{item.percent}%</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
