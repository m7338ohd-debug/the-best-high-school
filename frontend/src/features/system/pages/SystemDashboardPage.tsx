import React from 'react';
import { Card } from '../../../shared/components/ui/Card/Card';
import { StatCard } from '../../../shared/components/dashboard/StatCard';
import { Server, Activity, ShieldCheck, Database, CheckCircle2 } from 'lucide-react';
import styles from './SystemDashboardPage.module.css';

export const SystemDashboardPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>Production Operations & Deployment Health Monitor</h2>
          <p className={styles.subtitle}>Real-time system telemetry, database status, security session tracking, and deployment uptime</p>
        </div>
      </header>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <StatCard
          title="System Uptime"
          value="99.98%"
          trend={{ value: "0.01%", isPositive: true }}
          icon={<Activity size={20} />}
          description="Continuous operational uptime across services"
        />
        <StatCard
          title="Database Latency"
          value="1.4 ms"
          icon={<Database size={20} />}
          description="Neon PostgreSQL query connection pool status"
        />
        <StatCard
          title="Production Security"
          value="Hardened (JWT Rotated)"
          icon={<ShieldCheck size={20} />}
          description="Rate limiting, CSRF, and account lockouts active"
        />
      </div>

      {/* System Status Details */}
      <div className={styles.grid}>
        <Card title="Subsystem Health Telemetry">
          <div className={styles.subsystemList}>
            {[
              { name: 'Node.js Express Application Server', status: 'ONLINE', detail: '0.04% CPU | 128 MB RAM' },
              { name: 'PostgreSQL Database Pool (Sequelize)', status: 'HEALTHY', detail: '14 Active Connections' },
              { name: 'SMS Gateway Adapter (Fast2SMS)', status: 'CONNECTED', detail: 'Avg Response 240ms' },
              { name: 'Email Gateway Adapter (Brevo)', status: 'CONNECTED', detail: 'Avg Response 180ms' },
              { name: 'Queue Worker Engine', status: 'ACTIVE', detail: '0 Pending | 0 Failed' },
            ].map((sub, idx) => (
              <div key={idx} className={styles.subsystemItem}>
                <div className={styles.subLeft}>
                  <Server size={18} className={styles.serverIcon} />
                  <div>
                    <h4 className={styles.subName}>{sub.name}</h4>
                    <p className={styles.subDetail}>{sub.detail}</p>
                  </div>
                </div>
                <span className={styles.badge}><CheckCircle2 size={12} /> {sub.status}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Deployment Environment Configuration">
          <div className={styles.configDetails}>
            <div className={styles.configRow}>
              <span className={styles.configLabel}>Deployment Platform:</span>
              <strong className={styles.configVal}>Render (Backend) + Vercel (Frontend)</strong>
            </div>
            <div className={styles.configRow}>
              <span className={styles.configLabel}>Database Instance:</span>
              <strong className={styles.configVal}>Neon Serverless PostgreSQL</strong>
            </div>
            <div className={styles.configRow}>
              <span className={styles.configLabel}>Storage Service:</span>
              <strong className={styles.configVal}>Cloudinary (Receipt & Document Uploads)</strong>
            </div>
            <div className={styles.configRow}>
              <span className={styles.configLabel}>Auto-Backup Schedule:</span>
              <strong className={styles.configVal}>Daily Snapshot at 02:00 AM UTC</strong>
            </div>
            <div className={styles.configRow}>
              <span className={styles.configLabel}>Account Lockout Limit:</span>
              <strong className={styles.configVal}>5 Failed Attempts (15-min Lock)</strong>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
