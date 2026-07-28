import { StudentRecord } from '../../features/students/types/student.types';

export interface FeePaymentRecord {
  id: string;
  receiptNo: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  className: string;
  sectionName: string;
  parentName: string;
  contact: string;
  feeCategory: string;
  amountPaid: number;
  fineAmount: number;
  remainingBalance: number;
  paymentChannel: string;
  referenceNo: string;
  collectedBy: string;
  paymentDate: string;
}

export interface StaffRecord {
  id: string;
  staffId: string;
  name: string;
  designation: string;
  department: string;
  contact: string;
  email: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
  joiningDate: string;
  qualification: string;
}

const STUDENTS_STORAGE_KEY = 'best_school_students_master';
const PAYMENTS_STORAGE_KEY = 'best_school_fee_payments';
const STAFF_STORAGE_KEY = 'best_school_staff_master';

export const getStoredStudents = (): StudentRecord[] => {
  try {
    const raw = localStorage.getItem(STUDENTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Error reading student storage:', e);
  }
  return [];
};

export const saveStudentToStorage = (newStudent: StudentRecord): StudentRecord[] => {
  const current = getStoredStudents();
  const existsIndex = current.findIndex(
    (s) => s.id === newStudent.id || s.admissionNo === newStudent.admissionNo
  );
  let updated: StudentRecord[];
  if (existsIndex >= 0) {
    updated = [...current];
    updated[existsIndex] = newStudent;
  } else {
    updated = [newStudent, ...current];
  }
  try {
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error writing student storage:', e);
  }
  return updated;
};

export const deleteStudentFromStorage = (id: string): StudentRecord[] => {
  const current = getStoredStudents();
  const updated = current.filter((s) => s.id !== id);
  try {
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error deleting student:', e);
  }
  return updated;
};

export const getStoredFeePayments = (): FeePaymentRecord[] => {
  try {
    const raw = localStorage.getItem(PAYMENTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Error reading payment storage:', e);
  }
  return [];
};

export const saveFeePaymentToStorage = (payment: FeePaymentRecord): FeePaymentRecord[] => {
  const current = getStoredFeePayments();
  const updated = [payment, ...current];
  try {
    localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error writing payment storage:', e);
  }
  return updated;
};

export const getStoredStaff = (): StaffRecord[] => {
  try {
    const raw = localStorage.getItem(STAFF_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Error reading staff storage:', e);
  }
  return [];
};

export const saveStaffToStorage = (staffMember: StaffRecord): StaffRecord[] => {
  const current = getStoredStaff();
  const existsIndex = current.findIndex((s) => s.id === staffMember.id || s.staffId === staffMember.staffId);
  let updated: StaffRecord[];
  if (existsIndex >= 0) {
    updated = [...current];
    updated[existsIndex] = staffMember;
  } else {
    updated = [staffMember, ...current];
  }
  try {
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error writing staff storage:', e);
  }
  return updated;
};

export const deleteStaffFromStorage = (id: string): StaffRecord[] => {
  const current = getStoredStaff();
  const updated = current.filter((s) => s.id !== id);
  try {
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error deleting staff:', e);
  }
  return updated;
};

const CLASS_CAPACITIES_STORAGE_KEY = 'best_school_class_capacities';

export const getStoredClassCapacities = (): Record<string, number> => {
  try {
    const raw = localStorage.getItem(CLASS_CAPACITIES_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading class capacities storage:', e);
  }
  return {};
};

export const saveClassCapacityToStorage = (className: string, capacity: number): Record<string, number> => {
  const current = getStoredClassCapacities();
  const updated = { ...current, [className]: capacity };
  try {
    localStorage.setItem(CLASS_CAPACITIES_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error writing class capacity storage:', e);
  }
  return updated;
};
