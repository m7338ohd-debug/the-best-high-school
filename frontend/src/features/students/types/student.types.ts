export type Gender = 'Male' | 'Female' | 'Other';
export type StudentStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'ALUMNI' | 'GRADUATED' | 'TRANSFERRED';
export type FeeStatus = 'Paid' | 'Partial' | 'Pending' | 'Defaulter';
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
export type SchoolHouse = 'Red House' | 'Blue House' | 'Green House' | 'Yellow House';
export type TransportType = 'School Bus' | 'Private Transport' | 'Self / Walking';
export type HostelStatus = 'Day Scholar' | 'Hostel Resident';

export interface StudentRecord {
  id: string;
  admissionNo: string;
  rollNo: string;
  studentName: string;
  className: string;
  sectionName: string;
  gender: Gender;
  dob: string;
  admissionDate: string;
  parentName: string;
  parentRelation: string;
  contact: string;
  email: string;
  address: string;
  feeStatus: FeeStatus;
  attendancePercent: number;
  status: StudentStatus;
  bloodGroup: BloodGroup;
  house: SchoolHouse;
  transport: TransportType;
  hostel: HostelStatus;
  avatarUrl?: string;
  lastUpdated: string;
}

export interface StudentFilterState {
  search: string;
  academicYear: string;
  className: string;
  sectionName: string;
  gender: string;
  status: string;
  feeStatus: string;
  admissionDateFrom: string;
  admissionDateTo: string;
  bloodGroup: string;
  house: string;
  transport: string;
  hostel: string;
}
