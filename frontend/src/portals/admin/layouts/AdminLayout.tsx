import React, { useState } from 'react';
import { Shield, Building2, CreditCard, Cpu, Activity, LogOut, Sparkles, Menu, X } from 'lucide-react';
import styles from './AdminLayout.module.css';

interface AdminLayoutProps {
  children: React.ReactNode;
  activePath: string;
  onNavigate: (path: string) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activePath, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'SaaS Executive Overview', path: '/admin/dashboard', icon: <Activity size={18} /> },
    { label: 'School Tenant Directory', path: '/admin/schools', icon: <Building2 size={18} /> },
    { label: '7-Step Onboarding Wizard', path: '/admin/onboarding', icon: <Sparkles size={18} /> },
    { label: 'Subscriptions & Licenses', path: '/admin/subscriptions', icon: <CreditCard size={18} /> },
    { label: 'AI Operations & Telemetry', path: '/admin/ai-operations', icon: <Cpu size={18} /> },
    { label: 'Global Audit Logs', path: '/admin/audit', icon: <Shield size={18} /> },
  ];

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <div className={styles.wrapper}>
      <aside className={`${styles.sidebar} ${mobileMenuOpen ? styles.mobileOpen : ''}`}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}><Shield size={22} /></div>
          <div>
            <h1 className={styles.brandTitle}>Super Admin</h1>
            <span className={styles.brandSubtitle}>Control Center</span>
          </div>
          <button className={styles.closeMobileBtn} onClick={() => setMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`${styles.navItem} ${activePath === item.path ? styles.activeItem : ''}`}
              onClick={() => handleNav(item.path)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className={styles.footer}>
          <button className={styles.logoutBtn} onClick={() => handleNav('/admin/login')}>
            <LogOut size={16} /> Exit Control Center
          </button>
        </div>
      </aside>

      {mobileMenuOpen && (
        <div className={styles.mobileBackdrop} onClick={() => setMobileMenuOpen(false)} />
      )}

      <main className={styles.mainContent}>
        <header className={styles.topHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button className={styles.hamburgerBtn} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu size={20} />
            </button>
            <div className={styles.headerTitle}>
              <Sparkles size={18} className={styles.sparkleIcon} />
              <span>Platform Owner Enterprise Operations Hub</span>
            </div>
          </div>
          <div className={styles.userProfile}>
            <span className={styles.userRole}>SUPER_ADMIN</span>
            <div className={styles.avatar}>SA</div>
          </div>
        </header>
        <div className={styles.body}>{children}</div>
      </main>
    </div>
  );
};
