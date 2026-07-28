import React, { useState, useEffect } from 'react';
import { Card } from '../../../shared/components/ui/Card/Card';
import { Button } from '../../../shared/components/ui/Button/Button';
import { Building2, CheckCircle2, XCircle, TrendingUp, Plus, LogIn, Sparkles, Inbox, Search, Activity, ShieldCheck } from 'lucide-react';
import { getStoredTenants, toggleTenantInStorage, SchoolTenant } from '../../../shared/utils/tenantStorage';
import styles from './SuperAdminDashboardPage.module.css';

interface SuperAdminDashboardPageProps {
  onNavigateToOnboarding: () => void;
  onNavigateToTenants: () => void;
  onImpersonateSchool: (schoolName: string) => void;
}

export const SuperAdminDashboardPage: React.FC<SuperAdminDashboardPageProps> = ({
  onNavigateToOnboarding,
  onNavigateToTenants,
  onImpersonateSchool,
}) => {
  const [tenants, setTenants] = useState<SchoolTenant[]>(getStoredTenants());
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/v1/system/tenants', {
        headers: { 'x-tenant-id': 'system-global' },
      });
      const data = await res.json();
      if (Array.isArray(data.data) && data.data.length > 0) {
        const local = getStoredTenants();
        const apiTenants: SchoolTenant[] = data.data.map((t: any) => ({
          id: t.id || `sch-${Math.random()}`,
          schoolName: t.schoolName || t.school_name || 'School Instance',
          board: t.board || 'CBSE',
          plan: t.plan || 'ENTERPRISE',
          licenseKey: t.licenseKey || t.license_key || 'SCH-ENT-2026',
          adminName: t.adminName || t.admin_name || 'Administrator',
          adminEmail: t.adminEmail || t.admin_email || 'admin@school.com',
          maxStudents: t.maxStudents || t.max_students || 2500,
          status: t.status || 'ACTIVE',
          createdAt: t.createdAt || t.created_at || '2026-07-27',
        }));
        // Merge without duplicates
        const merged = [...local];
        apiTenants.forEach((a) => {
          if (!merged.some((m) => m.id === a.id || m.licenseKey === a.licenseKey)) {
            merged.push(a);
          }
        });
        setTenants(merged);
      } else {
        setTenants(getStoredTenants());
      }
    } catch (err) {
      setTenants(getStoredTenants());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const activeTenants = tenants.filter((t) => t.status === 'ACTIVE');
  const deactivatedTenants = tenants.filter((t) => t.status === 'DEACTIVATED');

  const filteredTenants = tenants.filter((t) => {
    const sName = (t.schoolName || '').toLowerCase();
    const aEmail = (t.adminEmail || '').toLowerCase();
    const lKey = (t.licenseKey || '').toLowerCase();
    const q = searchQuery.toLowerCase();
    return sName.includes(q) || aEmail.includes(q) || lKey.includes(q);
  });

  const toggleStatus = (id: string, name: string) => {
    const updated = toggleTenantInStorage(id);
    setTenants(updated);
    setToastMessage(`Tenant status for '${name}' updated.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className={styles.container}>
      {/* Top Banner Header */}
      <header className={styles.header}>
        <div>
          <div className={styles.adminBadge}>
            <Sparkles size={14} /> Master SaaS Overview & Telemetry
          </div>
          <h1 className={styles.title}>Super Admin Control Center</h1>
          <p className={styles.subtitle}>Provision tenants, monitor MRR growth metrics, and manage live school instances</p>
        </div>
        <div className={styles.headerActions}>
          <Button variant="outline" onClick={onNavigateToTenants}>
            View Tenant Directory ({tenants.length})
          </Button>
          <Button variant="primary" leftIcon={<Plus size={16} />} onClick={onNavigateToOnboarding}>
            Create New School Tenant
          </Button>
        </div>
      </header>

      {toastMessage && (
        <div className={styles.toastNotice}>
          <ShieldCheck size={16} /> {toastMessage}
        </div>
      )}

      {/* 4 High-Level KPI Summary Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Total School Tenants</span>
            <div className={`${styles.kpiIcon} ${styles.iconPurple}`}><Building2 size={22} /></div>
          </div>
          <strong className={styles.kpiValue}>{tenants.length}</strong>
          <div className={styles.kpiFooter}>
            <span className={styles.kpiSub}>Provisioned Tenant Directory</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Active Tenants</span>
            <div className={`${styles.kpiIcon} ${styles.iconGreen}`}><CheckCircle2 size={22} /></div>
          </div>
          <strong className={styles.kpiValue}>{activeTenants.length}</strong>
          <div className={styles.kpiFooter}>
            <span className={styles.kpiBadgeGreen}>LIVE ERP WORKSPACES</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Deactive Tenants</span>
            <div className={`${styles.kpiIcon} ${styles.iconRed}`}><XCircle size={22} /></div>
          </div>
          <strong className={styles.kpiValue}>{deactivatedTenants.length}</strong>
          <div className={styles.kpiFooter}>
            <span className={styles.kpiSub}>Suspended Access</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Annual SaaS Revenue</span>
            <div className={`${styles.kpiIcon} ${styles.iconBlue}`}><TrendingUp size={22} /></div>
          </div>
          <strong className={styles.kpiValue}>₹{(activeTenants.length * 150000).toLocaleString('en-IN')}</strong>
          <div className={styles.kpiFooter}>
            <span className={styles.kpiBadgePurple}>+18.4% ARR Growth</span>
          </div>
        </div>
      </div>

      {/* SaaS Growth Trajectory Graph Card */}
      <Card title="SaaS Tenant Growth & ARR Trajectory">
        <div className={styles.graphCardContent}>
          <div className={styles.graphHeader}>
            <div>
              <span className={styles.graphLabel}>Active School Growth Level</span>
              <h3 className={styles.graphTitle}>{activeTenants.length} Active School Subscriptions</h3>
            </div>
            <div className={styles.graphMetrics}>
              <div className={styles.metricItem}>
                <span className={styles.mDotPurple}></span>
                <span>Pro Tiers: <strong>50%</strong></span>
              </div>
              <div className={styles.metricItem}>
                <span className={styles.mDotBlue}></span>
                <span>Enterprise Tiers: <strong>50%</strong></span>
              </div>
            </div>
          </div>

          <div className={styles.chartVisual}>
            <svg viewBox="0 0 800 120" className={styles.chartSvg}>
              <defs>
                <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7e22ce" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d="M0,100 C150,90 250,50 400,60 C550,70 650,20 800,10 L800,120 L0,120 Z" fill="url(#purpleGrad)" />
              <path d="M0,100 C150,90 250,50 400,60 C550,70 650,20 800,10" fill="none" stroke="#7e22ce" strokeWidth="4" />
            </svg>
          </div>
        </div>
      </Card>

      {/* Active Tenants Directory Table */}
      <Card title="Provisioned School Tenants Directory">
        <div className={styles.tableToolbar}>
          <div className={styles.searchBox}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search school name, admin email, or license key..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="primary" leftIcon={<Plus size={16} />} onClick={onNavigateToOnboarding}>
            Create Tenant
          </Button>
        </div>

        {loading ? (
          <div className={styles.loadingBox}>
            <Activity size={24} className={styles.spinner} />
            <span>Loading Tenant Directory...</span>
          </div>
        ) : filteredTenants.length === 0 ? (
          <div className={styles.emptyState}>
            <Inbox size={44} className={styles.emptyIcon} />
            <h4>No School Tenants Found</h4>
            <p>Click <strong>"Create Tenant"</strong> to onboard a new school instance.</p>
            <Button variant="primary" leftIcon={<Plus size={16} />} onClick={onNavigateToOnboarding}>
              Create Tenant Shortcut
            </Button>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>School Name</th>
                  <th>Board</th>
                  <th>SaaS Plan</th>
                  <th>Admin Email</th>
                  <th>License Key</th>
                  <th>Student Quota</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTenants.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <div className={styles.schoolCell}>
                        <div className={styles.schoolIconBox}><Building2 size={18} /></div>
                        <div>
                          <strong className={styles.schoolTitle}>{t.schoolName}</strong>
                          <span className={styles.tenantId}>{t.id.slice(0, 12)}</span>
                        </div>
                      </div>
                    </td>
                    <td><span className={styles.boardTag}>{t.board}</span></td>
                    <td><span className={styles.planPill}>{t.plan}</span></td>
                    <td><code className={styles.emailCode}>{t.adminEmail}</code></td>
                    <td><code className={styles.licenseCode}>{t.licenseKey}</code></td>
                    <td><strong>{t.maxStudents}</strong> Enrolled</td>
                    <td>
                      <span className={`${styles.statusPill} ${t.status === 'ACTIVE' ? styles.statusActive : styles.statusDeactive}`}>
                        {t.status}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionGroup}>
                        <Button
                          variant="primary"
                          leftIcon={<LogIn size={14} />}
                          onClick={() => onImpersonateSchool(t.schoolName)}
                        >
                          Login As School
                        </Button>
                        <button
                          className={styles.deactivateBtn}
                          onClick={() => toggleStatus(t.id, t.schoolName)}
                        >
                          {t.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
