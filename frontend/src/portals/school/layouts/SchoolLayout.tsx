import React, { useState } from 'react';
import { School, GraduationCap, DollarSign, MessageSquare, FileText, Settings, LogOut, Lock, Menu, X } from 'lucide-react';
import { useSchoolSettings } from '../../../shared/context/SchoolContext';
import styles from './SchoolLayout.module.css';

interface SchoolLayoutProps {
  children: React.ReactNode;
  activePath: string;
  onNavigate: (path: string) => void;
  impersonatedByAdmin?: boolean;
}

export const SchoolLayout: React.FC<SchoolLayoutProps> = ({ children, activePath, onNavigate, impersonatedByAdmin }) => {
  const { profile, activeAcademicYear } = useSchoolSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'School Dashboard', path: '/app/dashboard', icon: <School size={18} /> },
    { label: 'Student Directory', path: '/app/students', icon: <GraduationCap size={18} /> },
    { label: 'Accountant Terminal', path: '/app/finance', icon: <DollarSign size={18} /> },
    { label: 'Parent Communication', path: '/app/communication', icon: <MessageSquare size={18} /> },
    { label: 'Reports & Compliance', path: '/app/reports', icon: <FileText size={18} /> },
    { label: 'School Settings', path: '/app/settings', icon: <Settings size={18} /> },
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <div className={styles.wrapper}>
      {impersonatedByAdmin && (
        <div className={styles.impersonateBanner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Lock size={14} />
            <span>Super Admin Session — Inspecting {profile.schoolName}</span>
          </div>
          <button className={styles.exitImpersonateBtn} onClick={() => onNavigate('/admin/schools')}>
            Exit Impersonation Mode
          </button>
        </div>
      )}

      <div className={styles.container}>
        {/* SIDEBAR NAVIGATION (Desktop Sticky & Mobile Drawer Overlay) */}
        <aside className={`${styles.sidebar} ${mobileMenuOpen ? styles.mobileOpen : ''}`}>
          <div className={styles.brand}>
            <div className={styles.brandIcon}>
              {profile.logoUrl ? (
                <img src={profile.logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 8 }} />
              ) : (
                <School size={22} />
              )}
            </div>
            <div>
              <h1 className={styles.brandTitle}>{profile.schoolName}</h1>
              <span className={styles.brandSubtitle}>Tenant ERP Workspace</span>
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
                onClick={() => handleNavClick(item.path)}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className={styles.footer}>
            <button className={styles.logoutBtn} onClick={() => handleNavClick('/login')}>
              <LogOut size={16} /> Sign Out
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
                {profile.logoUrl ? (
                  <img src={profile.logoUrl} alt="Logo" style={{ width: 22, height: 22, objectFit: 'contain', borderRadius: 4 }} />
                ) : (
                  <School size={18} className={styles.schoolIcon} />
                )}
                <span>{profile.schoolName} • Term {activeAcademicYear.yearName}</span>
              </div>
            </div>

            <div className={styles.userProfile}>
              <span className={styles.userRole}>ACCOUNTANT</span>
              <div className={styles.avatar}>AC</div>
            </div>
          </header>
          <div className={styles.body}>{children}</div>
        </main>
      </div>
    </div>
  );
};
