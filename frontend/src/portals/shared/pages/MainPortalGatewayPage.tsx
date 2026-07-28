import React from 'react';
import { School, Shield, ArrowRight, Sparkles, Building2, Layers, DollarSign } from 'lucide-react';
import styles from './MainPortalGatewayPage.module.css';

interface MainPortalGatewayPageProps {
  onSelectSuperAdmin: () => void;
  onSelectSchoolPortal: () => void;
}

export const MainPortalGatewayPage: React.FC<MainPortalGatewayPageProps> = ({
  onSelectSuperAdmin,
  onSelectSchoolPortal,
}) => {
  return (
    <div className={styles.container}>
      {/* 3D Animated Background Elements */}
      <div className={styles.bgVisual}>
        <div className={styles.orbPurple}></div>
        <div className={styles.orbBlue}></div>
        <div className={styles.gridPattern}></div>
      </div>

      <div className={styles.contentWrapper}>
        <header className={styles.header}>
          <div className={styles.brandBadge}>
            <Sparkles size={16} /> Enterprise Multi-Tenant SaaS Platform
          </div>
          <h1 className={styles.mainTitle}>The Best School ERP</h1>
          <p className={styles.mainSubtitle}>Select your portal login path to proceed</p>
        </header>

        {/* Dual Portal Gateway Cards */}
        <div className={styles.cardsGrid}>
          {/* Card 1: School Tenant Login */}
          <div className={styles.portalCard} onClick={onSelectSchoolPortal}>
            <div className={styles.cardHeaderSchool}>
              <div className={styles.iconBadgeSchool}><School size={28} /></div>
              <span className={styles.portalTagSchool}>Tenant Workspace</span>
            </div>

            <h3 className={styles.cardTitle}>School ERP & Finance Portal</h3>
            <p className={styles.cardDescription}>
              Portal access for invited school staff, accountants, and administrators. Manage admissions, fee collections, daily cash closing, and parent SMS alerts.
            </p>

            <div className={styles.featureList}>
              <div className={styles.featureItem}><DollarSign size={14} /> Rapid Accountant Fee Terminal</div>
              <div className={styles.featureItem}><Building2 size={14} /> Multi-Tenant Data Isolation</div>
            </div>

            <button className={styles.actionBtnSchool}>
              <span>Login as School Tenant</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Card 2: Super Admin Login */}
          <div className={styles.portalCard} onClick={onSelectSuperAdmin}>
            <div className={styles.cardHeaderAdmin}>
              <div className={styles.iconBadgeAdmin}><Shield size={28} /></div>
              <span className={styles.portalTagAdmin}>SaaS Control Center</span>
            </div>

            <h3 className={styles.cardTitle}>Super Admin Control Hub</h3>
            <p className={styles.cardDescription}>
              Master portal for software owners. Provision new school tenants, send automated Gmail invitations, track MRR revenue analytics, and monitor AI telemetry.
            </p>

            <div className={styles.featureList}>
              <div className={styles.featureItem}><Sparkles size={14} /> Automated Tenant Provisioning</div>
              <div className={styles.featureItem}><Layers size={14} /> SaaS MRR Analytics & Telemetry</div>
            </div>

            <button className={styles.actionBtnAdmin}>
              <span>Login as Super Admin</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <footer className={styles.footer}>
          <span>Protected by Enterprise Security Standards • 2026 The Best School SaaS</span>
        </footer>
      </div>
    </div>
  );
};
