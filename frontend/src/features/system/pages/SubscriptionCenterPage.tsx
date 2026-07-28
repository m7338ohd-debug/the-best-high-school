import React from 'react';
import { Card } from '../../../shared/components/ui/Card/Card';
import { Award, CheckCircle2, Calendar, Key } from 'lucide-react';
import styles from './SubscriptionCenterPage.module.css';

export const SubscriptionCenterPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>SaaS Subscription & Enterprise License Center</h2>
          <p className={styles.subtitle}>Manage school tier subscription plans, student quotas, license keys, and active SaaS feature flags</p>
        </div>
      </header>

      <div className={styles.grid}>
        <Card title="Current Subscription Plan">
          <div className={styles.planCard}>
            <div className={styles.planBadge}>
              <Award size={18} /> ENTERPRISE TIER
            </div>
            <h3 className={styles.planTitle}>Full School SaaS ERP Suite</h3>
            <p className={styles.planDesc}>Includes Unlimited Fee Structures, Automated Communication Gateway, Financial Analytics, and Disaster Recovery.</p>

            <div className={styles.quotaMeter}>
              <div className={styles.quotaHeader}>
                <span>Active Enrolled Student Quota</span>
                <strong>1,280 / 2,500 Students</strong>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: '51.2%' }}></div>
              </div>
            </div>

            <div className={styles.licenseDetails}>
              <div className={styles.detailRow}>
                <Key size={14} className={styles.detailIcon} />
                <span>License Key: <strong>LIC-BESTSCHOOL-2026-ENTERPRISE</strong></span>
              </div>
              <div className={styles.detailRow}>
                <Calendar size={14} className={styles.detailIcon} />
                <span>Billing Expiry: <strong>2027-12-31 (17 Months Remaining)</strong></span>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Active SaaS Enterprise Feature Flags">
          <div className={styles.featureList}>
            {[
              { name: 'Multi-Tenant Isolation Architecture', active: true },
              { name: 'Double-Entry Fee Ledger Engine', active: true },
              { name: 'Gapless Sequential Receipt Generator', active: true },
              { name: 'Daily Cash Closing & Lock Register', active: true },
              { name: 'Pluggable SMS & Email Queue Dispatcher', active: true },
              { name: 'Executive Revenue Forecasting & Analytics', active: true },
              { name: 'Multi-Format PDF, Excel, & CSV Exporters', active: true },
              { name: 'Disaster Recovery Automated Snapshot Engine', active: true },
            ].map((feat, idx) => (
              <div key={idx} className={styles.featureItem}>
                <span className={styles.featureName}>{feat.name}</span>
                <span className={styles.activeTag}><CheckCircle2 size={12} /> ENABLED</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
