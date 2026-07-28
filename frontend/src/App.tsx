import React, { useState, useEffect } from 'react';

// Shared Main Gateway Landing Import
import { MainPortalGatewayPage } from './portals/shared/pages/MainPortalGatewayPage';

// Super Admin Control Center Imports (/admin/*)
import { AdminLayout } from './portals/admin/layouts/AdminLayout';
import { SuperAdminLoginPage } from './portals/admin/pages/SuperAdminLoginPage';
import { SuperAdminDashboardPage } from './portals/admin/pages/SuperAdminDashboardPage';
import { SchoolOnboardingWizardPage } from './portals/admin/pages/SchoolOnboardingWizardPage';
import { TenantManagerPage } from './portals/admin/pages/TenantManagerPage';

// School ERP Workspace Imports (/app/*)
import { SchoolLayout } from './portals/school/layouts/SchoolLayout';
import { SchoolLoginPage } from './portals/school/pages/SchoolLoginPage';
import { SchoolDashboardPage } from './portals/school/pages/SchoolDashboardPage';
import { AcceptInvitationPage } from './portals/school/pages/AcceptInvitationPage';
import { StudentListPage } from './features/students/pages/StudentListPage';
import { FeeCollectionTerminalPage } from './features/finance/pages/FeeCollectionTerminalPage';
import { CommunicationDashboardPage } from './features/communication/pages/CommunicationDashboardPage';
import { FinanceReportsPage } from './features/finance-reports/pages/FinanceReportsPage';
import { SchoolSettingsPage } from './features/school-settings/pages/SchoolSettingsPage';

// Shared Features
import { SystemDashboardPage } from './features/system/pages/SystemDashboardPage';
import { SubscriptionCenterPage } from './features/system/pages/SubscriptionCenterPage';

import { useSchoolSettings } from './shared/context/SchoolContext';

export const App: React.FC = () => {
  const { profile, updateProfile } = useSchoolSettings();

  // Navigation State: 'main' | 'admin' | 'school' | 'invitation'
  const [activePortal, setActivePortal] = useState<'main' | 'admin' | 'school' | 'invitation'>('main');
  const [adminPath, setAdminPath] = useState('/admin/dashboard');
  const [schoolPath, setSchoolPath] = useState('/app/dashboard');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isSchoolLoggedIn, setIsSchoolLoggedIn] = useState(false);
  const [isImpersonating, setIsImpersonating] = useState(false);

  // Detect Email Activation link (?portal=invitation or /accept-invitation or ?token=... &email=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const path = window.location.pathname;

    if (
      path.includes('/accept-invitation') ||
      params.get('portal') === 'invitation' ||
      params.has('token') ||
      params.has('email')
    ) {
      setActivePortal('invitation');
      const schoolParam = params.get('school');
      const emailParam = params.get('email');
      updateProfile({
        ...(schoolParam ? { schoolName: schoolParam } : {}),
        ...(emailParam ? { email: emailParam } : {}),
      });
    }
  }, [updateProfile]);

  // Handle Impersonation ("Login As School")
  const handleImpersonate = (schoolName?: string) => {
    if (schoolName) {
      updateProfile({ schoolName });
    }
    setIsImpersonating(true);
    setActivePortal('school');
    setIsSchoolLoggedIn(true);
    setSchoolPath('/app/dashboard');
  };

  // Helper to clear URL invitation parameters cleanly
  const clearUrlInvitationParams = () => {
    if (window.history && window.history.pushState) {
      window.history.pushState({}, document.title, window.location.pathname);
    }
  };

  // 1. Main Gateway Portal Selection Page
  if (activePortal === 'main') {
    return (
      <MainPortalGatewayPage
        onSelectSuperAdmin={() => {
          setActivePortal('admin');
          setIsAdminLoggedIn(false);
          setAdminPath('/admin/login');
        }}
        onSelectSchoolPortal={() => {
          setActivePortal('school');
          setIsSchoolLoggedIn(false);
          setSchoolPath('/login');
        }}
      />
    );
  }

  // 2. Accept Invitation Password Creation Page (/accept-invitation)
  if (activePortal === 'invitation') {
    return (
      <AcceptInvitationPage
        onInvitationAccepted={(email: string, schoolName?: string) => {
          // Update profile with activated email & school name
          updateProfile({
            email,
            ...(schoolName ? { schoolName } : {}),
          });
          // Clean invitation query tokens from browser URL bar
          clearUrlInvitationParams();
          // Navigate DIRECTLY to School Login Page with prefilled email
          setActivePortal('school');
          setIsSchoolLoggedIn(false);
          setSchoolPath('/login');
        }}
      />
    );
  }

  // 3. Super Admin Control Center Portal (/admin/*)
  if (activePortal === 'admin') {
    if (!isAdminLoggedIn || adminPath === '/admin/login') {
      return <SuperAdminLoginPage onLoginSuccess={() => { setIsAdminLoggedIn(true); setAdminPath('/admin/dashboard'); }} />;
    }

    return (
      <AdminLayout activePath={adminPath} onNavigate={(path) => {
        if (path === '/admin/login') {
          setIsAdminLoggedIn(false);
          setActivePortal('main');
          return;
        }
        setAdminPath(path);
      }}>
        {adminPath === '/admin/schools' ? (
          <TenantManagerPage
            onImpersonate={(school) => handleImpersonate(school)}
            onCreateTenant={() => setAdminPath('/admin/onboarding')}
          />
        ) : adminPath === '/admin/onboarding' ? (
          <SchoolOnboardingWizardPage
            onNavigateToDirectory={() => setAdminPath('/admin/schools')}
          />
        ) : adminPath === '/admin/subscriptions' ? (
          <SubscriptionCenterPage />
        ) : adminPath === '/admin/ai-operations' ? (
          <SystemDashboardPage />
        ) : (
          <SuperAdminDashboardPage
            onNavigateToOnboarding={() => setAdminPath('/admin/onboarding')}
            onNavigateToTenants={() => setAdminPath('/admin/schools')}
            onImpersonateSchool={(school) => handleImpersonate(school)}
          />
        )}
      </AdminLayout>
    );
  }

  // 4. School ERP Workspace Portal (/app/*)
  if (!isSchoolLoggedIn || schoolPath === '/login') {
    return (
      <SchoolLoginPage
        onLoginSuccess={() => {
          setIsSchoolLoggedIn(true);
          setSchoolPath('/app/dashboard');
        }}
      />
    );
  }

  return (
    <SchoolLayout
      activePath={schoolPath}
      onNavigate={(path) => {
        if (path === '/admin/schools') {
          setIsImpersonating(false);
          setActivePortal('admin');
          setAdminPath('/admin/schools');
          return;
        }
        if (path === '/login') {
          // Clean invitation tokens and navigate directly to School Login Page
          clearUrlInvitationParams();
          setIsSchoolLoggedIn(false);
          setIsImpersonating(false);
          setActivePortal('school');
          setSchoolPath('/login');
          return;
        }
        setSchoolPath(path);
      }}
      impersonatedByAdmin={isImpersonating}
    >
      {schoolPath === '/app/students' ? (
        <StudentListPage onNewAdmission={() => {}} />
      ) : schoolPath === '/app/finance' ? (
        <FeeCollectionTerminalPage />
      ) : schoolPath === '/app/communication' ? (
        <CommunicationDashboardPage />
      ) : schoolPath === '/app/reports' ? (
        <FinanceReportsPage />
      ) : schoolPath === '/app/settings' ? (
        <SchoolSettingsPage />
      ) : (
        <SchoolDashboardPage
          schoolName={profile.schoolName}
          onNavigateToFinance={() => setSchoolPath('/app/finance')}
          onNavigateToStudents={() => setSchoolPath('/app/students')}
          onNavigateToReports={() => setSchoolPath('/app/reports')}
        />
      )}
    </SchoolLayout>
  );
};

export default App;
