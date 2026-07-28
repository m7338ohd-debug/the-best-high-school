import React from 'react';
import { Card } from '../../../shared/components/ui/Card/Card';
import { StatCard } from '../../../shared/components/dashboard/StatCard';
import { DollarSign, TrendingUp, ShieldCheck, PieChart } from 'lucide-react';
import styles from './FinanceIntelligenceDashboardPage.module.css';

export const FinanceIntelligenceDashboardPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>Executive Financial Intelligence & Analytics</h2>
          <p className={styles.subtitle}>Revenue forecasting, collection efficiency analysis, and real-time cash flow trends</p>
        </div>
      </header>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <StatCard
          title="Projected Month-End Revenue"
          value="$164,277.50"
          trend={{ value: "14.8%", isPositive: true }}
          icon={<DollarSign size={20} />}
          description="Revenue forecast based on historical collection trends"
        />
        <StatCard
          title="Collection Efficiency"
          value="94.8%"
          trend={{ value: "2.1%", isPositive: true }}
          icon={<TrendingUp size={20} />}
          description="Percentage of generated fees collected to date"
        />
        <StatCard
          title="System Financial Health"
          value="100 / 100"
          icon={<ShieldCheck size={20} />}
          description="Zero receipt sequence gaps or ledger discrepancies"
        />
      </div>

      {/* Analytics Charts */}
      <div className={styles.chartsGrid}>
        <Card title="Monthly Revenue Growth & Forecast Trend">
          <div className={styles.trendVisual}>
            <div className={styles.barGroup}>
              <div className={styles.bar} style={{ height: '60%' }}><span className={styles.barVal}>$95k</span></div>
              <span className={styles.barLabel}>May</span>
            </div>
            <div className={styles.barGroup}>
              <div className={styles.bar} style={{ height: '75%' }}><span className={styles.barVal}>$120k</span></div>
              <span className={styles.barLabel}>Jun</span>
            </div>
            <div className={styles.barGroup}>
              <div className={`${styles.bar} ${styles.activeBar}`} style={{ height: '90%' }}><span className={styles.barVal}>$142k</span></div>
              <span className={styles.barLabel}>Jul (Current)</span>
            </div>
            <div className={styles.barGroup}>
              <div className={`${styles.bar} ${styles.projectedBar}`} style={{ height: '100%' }}><span className={styles.barVal}>$164k</span></div>
              <span className={styles.barLabel}>Aug (Forecast)</span>
            </div>
          </div>
        </Card>

        <Card title="Payment Mode Channel Distribution">
          <div className={styles.paymentDist}>
            {[
              { mode: 'UPI / QR Code', percent: '48%', amount: '$68,568', color: '#4f46e5' },
              { mode: 'Bank Transfer (NEFT)', percent: '28%', amount: '$39,998', color: '#0284c7' },
              { mode: 'Cash Counter', percent: '18%', amount: '$25,713', color: '#10b981' },
              { mode: 'Credit / Debit Card', percent: '6%', amount: '$8,571', color: '#f59e0b' },
            ].map((item, idx) => (
              <div key={idx} className={styles.distRow}>
                <div className={styles.distLabel}>
                  <PieChart size={14} style={{ color: item.color }} />
                  <span>{item.mode}</span>
                </div>
                <div className={styles.distMeta}>
                  <strong>{item.amount}</strong>
                  <span className={styles.badge}>{item.percent}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
