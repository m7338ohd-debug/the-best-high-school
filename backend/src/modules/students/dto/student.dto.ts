export interface StudentAdmissionDTO {
  admissionDate: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth: string;
  bloodGroup?: string;
  nationality?: string;
  religion?: string;
  motherTongue?: string;
  currentAddress?: string;
  permanentAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  medicalConditions?: string;
  allergies?: string;

  // Academic Enrolment
  academicYearId: string;
  classId: string;
  sectionId: string;
  rollNumber: number;

  // Parent Contact Info
  fatherName?: string;
  fatherMobile?: string;
  fatherEmail?: string;
  motherName?: string;
  motherMobile?: string;
  emergencyContact: string;
  primaryContact?: 'FATHER' | 'MOTHER' | 'GUARDIAN';
}

export interface BulkPromotionDTO {
  fromAcademicYearId: string;
  toAcademicYearId: string;
  fromClassId: string;
  toClassId: string;
  fromSectionId: string;
  toSectionId: string;
  studentIds: string[];
}
