import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AcademicYearItem {
  id: string;
  yearName: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'UPCOMING' | 'PAST';
  isCurrent: boolean;
}

export interface PaymentModeConfig {
  id: string;
  name: string;
  enabled: boolean;
  details?: string;
}

export interface SchoolProfile {
  schoolName: string;
  schoolCode: string;
  logoUrl: string;
  tagline: string;
  principalName: string;
  board: string;
  email: string;
  phone: string;
  address: string;
  affiliationNo: string;
}

export interface FinancialRules {
  currency: string;
  currencySymbol: string;
  receiptPrefix: string;
  receiptCounterStart: number;
  gstPercentage: number;
  fiscalYearStartMonth: string;
  upiId?: string;
  bankAccountDetails?: string;
}

export interface FeeRules {
  gracePeriodDays: number;
  lateFineAmount: number;
  maxFineCap: number;
  fineCalculationType: 'PER_DAY' | 'ONE_TIME';
  autoRemindersEnabled: boolean;
}

export interface SchoolContextType {
  profile: SchoolProfile;
  academicYears: AcademicYearItem[];
  activeAcademicYear: AcademicYearItem;
  financialRules: FinancialRules;
  feeRules: FeeRules;
  paymentModes: PaymentModeConfig[];
  updateProfile: (data: Partial<SchoolProfile>) => void;
  uploadLogo: (logoDataUrl: string) => void;
  removeLogo: () => void;
  addAcademicYear: (year: Omit<AcademicYearItem, 'id' | 'status' | 'isCurrent'>, setAsActive?: boolean) => void;
  setActiveAcademicYear: (id: string) => void;
  deleteAcademicYear: (id: string) => void;
  updateFinancialRules: (data: Partial<FinancialRules>) => void;
  updateFeeRules: (data: Partial<FeeRules>) => void;
  updatePaymentModes: (modes: PaymentModeConfig[]) => void;
  resetToBlankSlate: (customSchoolName?: string) => void;
}

const DEFAULT_PROFILE: SchoolProfile = {
  schoolName: 'St. Jude International Academy',
  schoolCode: 'STJUDE-2026',
  logoUrl: '',
  tagline: 'Excellence in Education & Character Building',
  principalName: 'Dr. Robert Vance',
  board: 'CBSE (Central Board of Secondary Education)',
  email: 'admin@stjude.edu',
  phone: '+91 98765 43210',
  address: 'Plot 42, Education Hub, Knowledge Park III, New Delhi',
  affiliationNo: 'AFF-1930482',
};

const DEFAULT_ACADEMIC_YEARS: AcademicYearItem[] = [
  {
    id: 'ay-2026-2027',
    yearName: '2026-2027',
    startDate: '2026-07-01',
    endDate: '2027-06-30',
    status: 'ACTIVE',
    isCurrent: true,
  },
  {
    id: 'ay-2025-2026',
    yearName: '2025-2026',
    startDate: '2025-07-01',
    endDate: '2026-06-30',
    status: 'PAST',
    isCurrent: false,
  },
];

const DEFAULT_FINANCIAL_RULES: FinancialRules = {
  currency: 'INR (₹) - Indian Rupee',
  currencySymbol: '₹',
  receiptPrefix: 'REC',
  receiptCounterStart: 1001,
  gstPercentage: 0,
  fiscalYearStartMonth: 'April',
  upiId: 'stjude@icici',
  bankAccountDetails: 'HDFC Bank - A/C 50200012345678 - IFSC HDFC0001234',
};

const DEFAULT_FEE_RULES: FeeRules = {
  gracePeriodDays: 7,
  lateFineAmount: 50,
  maxFineCap: 500,
  fineCalculationType: 'PER_DAY',
  autoRemindersEnabled: true,
};

const DEFAULT_PAYMENT_MODES: PaymentModeConfig[] = [
  { id: 'CASH', name: 'Cash Payment (Counter)', enabled: true, details: 'Cash counter 1 & 2' },
  { id: 'UPI', name: 'UPI / QR Code', enabled: true, details: 'stjude@icici' },
  { id: 'BANK_TRANSFER', name: 'Bank Transfer (NEFT/IMPS)', enabled: true, details: 'HDFC Bank A/C 50200012345678' },
  { id: 'CARD', name: 'Credit / Debit Card (POS)', enabled: true, details: 'POS Terminal 1' },
  { id: 'CHEQUE', name: 'Bank Cheque', enabled: true, details: 'Payable to St. Jude Academy' },
];

const LOCAL_STORAGE_KEY = 'school_erp_master_settings';

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<SchoolProfile>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.profile) return parsed.profile;
      }
    } catch (e) {
      console.error('Error loading school profile from storage', e);
    }
    return DEFAULT_PROFILE;
  });

  const [academicYears, setAcademicYears] = useState<AcademicYearItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.academicYears && parsed.academicYears.length > 0) return parsed.academicYears;
      }
    } catch (e) {
      console.error('Error loading academic years from storage', e);
    }
    return DEFAULT_ACADEMIC_YEARS;
  });

  const [financialRules, setFinancialRules] = useState<FinancialRules>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.financialRules) return { ...DEFAULT_FINANCIAL_RULES, ...parsed.financialRules };
      }
    } catch (e) {
      console.error('Error loading financial rules', e);
    }
    return DEFAULT_FINANCIAL_RULES;
  });

  const [feeRules, setFeeRules] = useState<FeeRules>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.feeRules) return parsed.feeRules;
      }
    } catch (e) {
      console.error('Error loading fee rules', e);
    }
    return DEFAULT_FEE_RULES;
  });

  const [paymentModes, setPaymentModes] = useState<PaymentModeConfig[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.paymentModes) return parsed.paymentModes;
      }
    } catch (e) {
      console.error('Error loading payment modes', e);
    }
    return DEFAULT_PAYMENT_MODES;
  });

  // Save to LocalStorage on state update
  useEffect(() => {
    try {
      const dataToSave = {
        profile,
        academicYears,
        financialRules,
        feeRules,
        paymentModes,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.error('Error saving settings to localStorage', e);
    }
  }, [profile, academicYears, financialRules, feeRules, paymentModes]);

  const activeAcademicYear =
    academicYears.find((y) => y.isCurrent) ||
    academicYears[0] || {
      id: 'ay-2026-2027',
      yearName: '2026-2027',
      startDate: '2026-07-01',
      endDate: '2027-06-30',
      status: 'ACTIVE',
      isCurrent: true,
    };

  const updateProfile = (data: Partial<SchoolProfile>) => {
    setProfile((prev) => ({ ...prev, ...data }));
  };

  const uploadLogo = (logoDataUrl: string) => {
    setProfile((prev) => ({ ...prev, logoUrl: logoDataUrl }));
  };

  const removeLogo = () => {
    setProfile((prev) => ({ ...prev, logoUrl: '' }));
  };

  const addAcademicYear = (
    year: Omit<AcademicYearItem, 'id' | 'status' | 'isCurrent'>,
    setAsActive: boolean = false
  ) => {
    const newId = `ay-${Date.now()}`;
    const newYearItem: AcademicYearItem = {
      ...year,
      id: newId,
      status: setAsActive ? 'ACTIVE' : 'UPCOMING',
      isCurrent: setAsActive,
    };

    setAcademicYears((prev) => {
      const updated = setAsActive ? prev.map((y) => ({ ...y, isCurrent: false, status: y.status === 'ACTIVE' ? 'PAST' as const : y.status })) : [...prev];
      return [newYearItem, ...updated];
    });
  };

  const setActiveAcademicYear = (id: string) => {
    setAcademicYears((prev) =>
      prev.map((y) => ({
        ...y,
        isCurrent: y.id === id,
        status: y.id === id ? 'ACTIVE' : y.status === 'ACTIVE' ? 'PAST' : y.status,
      }))
    );
  };

  const deleteAcademicYear = (id: string) => {
    setAcademicYears((prev) => prev.filter((y) => y.id !== id));
  };

  const updateFinancialRules = (data: Partial<FinancialRules>) => {
    setFinancialRules((prev) => ({
      ...prev,
      ...data,
      currency: 'INR (₹) - Indian Rupee',
      currencySymbol: '₹',
    }));
  };

  const updateFeeRules = (data: Partial<FeeRules>) => {
    setFeeRules((prev) => ({ ...prev, ...data }));
  };

  const updatePaymentModes = (modes: PaymentModeConfig[]) => {
    setPaymentModes(modes);
  };

  const resetToBlankSlate = (customSchoolName: string = 'My School Academy') => {
    const blankProfile: SchoolProfile = {
      schoolName: customSchoolName,
      schoolCode: 'SCH-2026',
      logoUrl: '',
      tagline: 'Excellence in Education',
      principalName: '',
      board: 'CBSE',
      email: 'admin@school.edu',
      phone: '',
      address: '',
      affiliationNo: '',
    };
    setProfile(blankProfile);
    setAcademicYears([
      {
        id: 'ay-2026-2027',
        yearName: '2026-2027',
        startDate: '2026-04-01',
        endDate: '2027-03-31',
        status: 'ACTIVE',
        isCurrent: true,
      },
    ]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return (
    <SchoolContext.Provider
      value={{
        profile,
        academicYears,
        activeAcademicYear,
        financialRules,
        feeRules,
        paymentModes,
        updateProfile,
        uploadLogo,
        removeLogo,
        addAcademicYear,
        setActiveAcademicYear,
        deleteAcademicYear,
        updateFinancialRules,
        updateFeeRules,
        updatePaymentModes,
        resetToBlankSlate,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchoolSettings = (): SchoolContextType => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchoolSettings must be used within a SchoolProvider');
  }
  return context;
};
