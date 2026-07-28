import React from 'react';
import { Card } from '../ui/Card/Card';
import styles from './StatCard.module.css';

export interface StatCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  description?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, trend, icon, description }) => {
  return (
    <Card className={styles.statCard}>
      <div className={styles.container}>
        <div className={styles.info}>
          <span className={styles.title}>{title}</span>
          <h3 className={styles.value}>{value}</h3>
          {trend && (
            <div className={`${styles.trend} ${trend.isPositive ? styles.positive : styles.negative}`}>
              <span>{trend.isPositive ? '↑' : '↓'} {trend.value}</span>
              <span className={styles.trendLabel}>vs last month</span>
            </div>
          )}
          {description && <p className={styles.description}>{description}</p>}
        </div>
        {icon && <div className={styles.iconWrapper}>{icon}</div>}
      </div>
    </Card>
  );
};
