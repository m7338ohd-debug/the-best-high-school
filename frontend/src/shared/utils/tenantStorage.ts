export interface SchoolTenant {
  id: string;
  schoolName: string;
  board: string;
  plan: string;
  licenseKey: string;
  adminName: string;
  adminEmail: string;
  maxStudents: number;
  status: 'ACTIVE' | 'DEACTIVATED';
  createdAt?: string;
}

const STORAGE_KEY = 'best_school_tenants_list';

const INITIAL_TENANTS: SchoolTenant[] = [
  {
    id: 'sch-uuid-001',
    schoolName: 'St. Jude International Academy',
    board: 'CBSE',
    plan: 'ENTERPRISE',
    licenseKey: 'SCH-ENT-2026-99887',
    adminName: 'Dr. Robert Vance',
    adminEmail: 'admin@stjude.edu',
    maxStudents: 2500,
    status: 'ACTIVE',
    createdAt: '2026-06-01',
  },
  {
    id: 'sch-uuid-002',
    schoolName: 'Greenwood Public School',
    board: 'ICSE',
    plan: 'PRO',
    licenseKey: 'SCH-PRO-2026-44321',
    adminName: 'Rajesh Sharma',
    adminEmail: 'admin@greenwood.edu',
    maxStudents: 1500,
    status: 'ACTIVE',
    createdAt: '2026-07-15',
  },
];

export const getStoredTenants = (): SchoolTenant[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading tenant storage:', e);
  }
  return INITIAL_TENANTS;
};

export const saveTenantToStorage = (newTenant: SchoolTenant): SchoolTenant[] => {
  const current = getStoredTenants();
  const exists = current.some(
    (t) => t.id === newTenant.id || t.licenseKey === newTenant.licenseKey || t.adminEmail === newTenant.adminEmail
  );
  const updated = exists ? current.map((t) => (t.id === newTenant.id ? newTenant : t)) : [newTenant, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error writing tenant storage:', e);
  }
  return updated;
};

export const toggleTenantInStorage = (id: string): SchoolTenant[] => {
  const current = getStoredTenants();
  const updated = current.map((t) =>
    t.id === id ? { ...t, status: t.status === 'ACTIVE' ? ('DEACTIVATED' as const) : ('ACTIVE' as const) } : t
  );
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error updating tenant storage:', e);
  }
  return updated;
};
