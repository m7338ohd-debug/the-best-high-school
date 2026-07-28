import React, { useState, useEffect } from 'react';
import { School, GraduationCap, DollarSign, MessageSquare, FileText, Settings, LogOut, Lock, Menu, Search, Command } from 'lucide-react';
import { useSchoolSettings } from '../../../shared/context/SchoolContext';
import { GlobalSearchModal } from '../../../shared/components/GlobalSearch/GlobalSearchModal';
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
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Global keydown handler for Ctrl+K, Cmd+K, or Ctrl+S
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'k' || e.key.toLowerCase() === 's')) {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

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
      {/* IMPERSONATION BAR */}
      {impersonatedByAdmin && (
        <div className={styles.impersonateBanner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Lock size={14} />
            <span>Active Admin Impersonation Session • Viewing workspace as <strong>{profile.schoolName}</strong></span>
          </div>
          <button className={styles.exitImpersonateBtn} onClick={() => handleNavClick('/super-admin')}>
            Exit Session
          </button>
        </div>
      )}

      <div className={styles.container}>
        {/* SIDEBAR NAVIGATION */}
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
              <h1 className={styles.brandTitle}>{profile.schoolName || 'The Best Public School'}</h1>
              <span className={styles.brandSubtitle}>{activeAcademicYear.yearName}</span>
            </div>
          </div>

          <nav className={styles.nav}>
            {navItems.map((item) => {
              const isActive = activePath === item.path;
              return (
                <button
                  key={item.path}
                  className={`${styles.navItem} ${isActive ? styles.activeItem : ''}`}
                  onClick={() => handleNavClick(item.path)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
              <button className={styles.hamburgerBtn} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <Menu size={20} />
              </button>
              
              {/* UNIVERSAL GLOBAL SEARCH TRIGGER BAR */}
              <div 
                className={styles.globalSearchWrapper}
                onClick={() => setIsSearchModalOpen(true)}
              >
                <div className={styles.globalSearchBox}>
                  <Search size={15} className={styles.globalSearchIcon} />
                  <span className={styles.globalSearchPlaceholder}>
                    Search students, fee receipts, reports, or modules...
                  </span>
                  <div className={styles.cmdShortcutBadge}>
                    <Command size={11} /> K
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.userProfile}>
              <span className={styles.userRole}>ACCOUNTANT</span>
              <div className={styles.avatar}>
                {profile.schoolName ? profile.schoolName.charAt(0) : 'S'}
              </div>
            </div>
          </header>

          <div className={styles.body}>
            {children}
          </div>
        </main>
      </div>

      {/* UNIVERSAL GLOBAL SEARCH COMMAND PALETTE MODAL */}
      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onNavigate={onNavigate}
      />
    </div>
  );
};
