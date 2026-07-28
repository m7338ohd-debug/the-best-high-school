import React from 'react';
import { 
  GraduationCap, 
  DollarSign, 
  Smile
} from 'lucide-react';
import styles from './StudentKpiGrid.module.css';

interface KpiCardData {
  id: string;
  title: string;
  count: number;
  unit?: string;
  icon: React.ReactNode;
  colorTheme: 'purple' | 'blue' | 'pink' | 'emerald' | 'red' | 'amber';
  description: string;
}

export const StudentKpiGrid: React.FC<{
  totalStudents?: number;
  boysCount?: number;
  girlsCount?: number;
  activeCount?: number;
  inactiveCount?: number;
  defaultersCount?: number;
}> = ({
  totalStudents = 0,
  boysCount = 0,
  girlsCount = 0,
  defaultersCount = 0,
}) => {
  const boysPercent = totalStudents > 0 ? Math.round((boysCount / totalStudents) * 100) : 0;
  const girlsPercent = totalStudents > 0 ? Math.round((girlsCount / totalStudents) * 100) : 0;

  const kpis: KpiCardData[] = [
    {
      id: 'total',
      title: 'Total Students',
      count: totalStudents,
      icon: <GraduationCap size={22} />,
      colorTheme: 'purple',
      description: 'Enrolled across all grades',
    },
    {
      id: 'boys',
      title: 'Boys',
      count: boysCount,
      unit: `(${boysPercent}%)`,
      icon: <Smile size={22} />,
      colorTheme: 'blue',
      description: 'Male student enrollment',
    },
    {
      id: 'girls',
      title: 'Girls',
      count: girlsCount,
      unit: `(${girlsPercent}%)`,
      icon: <Smile size={22} />,
      colorTheme: 'pink',
      description: 'Female student enrollment',
    },
    {
      id: 'defaulters',
      title: 'Fee Defaulters',
      count: defaultersCount,
      icon: <DollarSign size={22} />,
      colorTheme: 'amber',
      description: 'Overdue fee balances pending',
    },
  ];

  return (
    <div className={styles.gridContainer}>
      {kpis.map((kpi) => (
        <div key={kpi.id} className={`${styles.card} ${styles[kpi.colorTheme]}`}>
          <div className={styles.cardHeader}>
            <div className={styles.iconWrapper}>{kpi.icon}</div>
          </div>

          <div className={styles.cardBody}>
            <span className={styles.cardTitle}>{kpi.title}</span>
            <div className={styles.countRow}>
              <h3 className={styles.countValue}>
                {kpi.count.toLocaleString('en-IN')}
              </h3>
              {kpi.unit && <span className={styles.unitText}>{kpi.unit}</span>}
            </div>
            <p className={styles.description}>{kpi.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
