import React from 'react';
import { LayoutDashboard, Users, GraduationCap, DollarSign, FileText, Bell, Settings, ShieldAlert, LogOut } from 'lucide-react';
import styles from './DashboardLayout.module.css';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  activePath?: string;
  userRole?: string;
  userName?: string;
  schoolName?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activePath = '/dashboard',
  userName = 'Admin User',
  schoolName = 'The Best School',
}) => {
  const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard' },
    { label: 'Students', icon: <GraduationCap size={18} />, path: '/students' },
    { label: 'Users & Staff', icon: <Users size={18} />, path: '/users' },
    { label: 'Fee Structures', icon: <DollarSign size={18} />, path: '/finance/structures' },
    { label: 'Fee Collection', icon: <FileText size={18} />, path: '/finance/collection' },
    { label: 'Notifications', icon: <Bell size={18} />, path: '/notifications' },
    { label: 'School Settings', icon: <Settings size={18} />, path: '/settings' },
    { label: 'Audit Logs', icon: <ShieldAlert size={18} />, path: '/audit' },
  ];

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandLogo}>BS</div>
          <div>
            <h1 className={styles.brandName}>{schoolName}</h1>
            <span className={styles.brandSub}>Finance SaaS</span>
          </div>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const isActive = activePath === item.path;
            return (
              <a
                key={item.path}
                href={item.path}
                className={`${styles.navItem} ${isActive ? styles.activeNavItem : ''}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>{userName.charAt(0)}</div>
            <div className={styles.userDetails}>
              <span className={styles.userName}>{userName}</span>
              <span className={styles.userRole}>School Admin</span>
            </div>
          </div>
          <button className={styles.logoutBtn} title="Sign Out">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={styles.mainWrapper}>
        <header className={styles.topbar}>
          <div className={styles.pageHeader}>
            <h2 className={styles.pageTitle}>Dashboard Overview</h2>
          </div>
          <div className={styles.topbarActions}>
            <button className={styles.iconBtn}>
              <Bell size={18} />
            </button>
          </div>
        </header>

        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
};
