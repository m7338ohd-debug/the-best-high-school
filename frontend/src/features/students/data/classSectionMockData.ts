export interface SectionModel {
  id: string;
  sectionName: string;
  className: string;
  classTeacher: string;
  totalStudents: number;
  capacity: number;
  availableSeats: number;
  boysCount: number;
  girlsCount: number;
  feeDefaultersCount: number;
  status: 'ACTIVE' | 'FULL' | 'INACTIVE';
  occupancyPercent: number;
}

export interface ClassModel {
  id: string;
  className: string;
  displayOrder: number;
  totalSections: number;
  totalStudents: number;
  capacity: number;
  availableSeats: number;
  academicYear: string;
  occupancyPercent: number;
  sections: SectionModel[];
}

export const mockClassesData: ClassModel[] = [
  {
    id: 'lkg',
    className: 'LKG',
    displayOrder: 1,
    totalSections: 2,
    totalStudents: 0,
    capacity: 80,
    availableSeats: 80,
    academicYear: '2026-2027',
    occupancyPercent: 0,
    sections: [
      { id: 'lkg-a', sectionName: 'Section A', className: 'LKG', classTeacher: 'Class Teacher', totalStudents: 0, capacity: 40, availableSeats: 40, boysCount: 0, girlsCount: 0, feeDefaultersCount: 0, status: 'ACTIVE', occupancyPercent: 0 },
      { id: 'lkg-b', sectionName: 'Section B', className: 'LKG', classTeacher: 'Class Teacher', totalStudents: 0, capacity: 40, availableSeats: 40, boysCount: 0, girlsCount: 0, feeDefaultersCount: 0, status: 'ACTIVE', occupancyPercent: 0 },
    ],
  },
  {
    id: 'ukg',
    className: 'UKG',
    displayOrder: 2,
    totalSections: 2,
    totalStudents: 0,
    capacity: 80,
    availableSeats: 80,
    academicYear: '2026-2027',
    occupancyPercent: 0,
    sections: [
      { id: 'ukg-a', sectionName: 'Section A', className: 'UKG', classTeacher: 'Class Teacher', totalStudents: 0, capacity: 40, availableSeats: 40, boysCount: 0, girlsCount: 0, feeDefaultersCount: 0, status: 'ACTIVE', occupancyPercent: 0 },
      { id: 'ukg-b', sectionName: 'Section B', className: 'UKG', classTeacher: 'Class Teacher', totalStudents: 0, capacity: 40, availableSeats: 40, boysCount: 0, girlsCount: 0, feeDefaultersCount: 0, status: 'ACTIVE', occupancyPercent: 0 },
    ],
  },
  {
    id: 'class-1',
    className: 'Class 1',
    displayOrder: 3,
    totalSections: 2,
    totalStudents: 0,
    capacity: 80,
    availableSeats: 80,
    academicYear: '2026-2027',
    occupancyPercent: 0,
    sections: [
      { id: 'c1-a', sectionName: 'Section A', className: 'Class 1', classTeacher: 'Class Teacher', totalStudents: 0, capacity: 40, availableSeats: 40, boysCount: 0, girlsCount: 0, feeDefaultersCount: 0, status: 'ACTIVE', occupancyPercent: 0 },
      { id: 'c1-b', sectionName: 'Section B', className: 'Class 1', classTeacher: 'Class Teacher', totalStudents: 0, capacity: 40, availableSeats: 40, boysCount: 0, girlsCount: 0, feeDefaultersCount: 0, status: 'ACTIVE', occupancyPercent: 0 },
    ],
  },
  {
    id: 'class-2',
    className: 'Class 2',
    displayOrder: 4,
    totalSections: 2,
    totalStudents: 0,
    capacity: 80,
    availableSeats: 80,
    academicYear: '2026-2027',
    occupancyPercent: 0,
    sections: [
      { id: 'c2-a', sectionName: 'Section A', className: 'Class 2', classTeacher: 'Class Teacher', totalStudents: 0, capacity: 40, availableSeats: 40, boysCount: 0, girlsCount: 0, feeDefaultersCount: 0, status: 'ACTIVE', occupancyPercent: 0 },
      { id: 'c2-b', sectionName: 'Section B', className: 'Class 2', classTeacher: 'Class Teacher', totalStudents: 0, capacity: 40, availableSeats: 40, boysCount: 0, girlsCount: 0, feeDefaultersCount: 0, status: 'ACTIVE', occupancyPercent: 0 },
    ],
  },
  {
    id: 'class-3',
    className: 'Class 3',
    displayOrder: 5,
    totalSections: 2,
    totalStudents: 0,
    capacity: 80,
    availableSeats: 80,
    academicYear: '2026-2027',
    occupancyPercent: 0,
    sections: [
      { id: 'c3-a', sectionName: 'Section A', className: 'Class 3', classTeacher: 'Class Teacher', totalStudents: 0, capacity: 40, availableSeats: 40, boysCount: 0, girlsCount: 0, feeDefaultersCount: 0, status: 'ACTIVE', occupancyPercent: 0 },
      { id: 'c3-b', sectionName: 'Section B', className: 'Class 3', classTeacher: 'Class Teacher', totalStudents: 0, capacity: 40, availableSeats: 40, boysCount: 0, girlsCount: 0, feeDefaultersCount: 0, status: 'ACTIVE', occupancyPercent: 0 },
    ],
  },
  {
    id: 'class-4',
    className: 'Class 4',
    displayOrder: 6,
    totalSections: 2,
    totalStudents: 0,
    capacity: 80,
    availableSeats: 80,
    academicYear: '2026-2027',
    occupancyPercent: 0,
    sections: [
      { id: 'c4-a', sectionName: 'Section A', className: 'Class 4', classTeacher: 'Class Teacher', totalStudents: 0, capacity: 40, availableSeats: 40, boysCount: 0, girlsCount: 0, feeDefaultersCount: 0, status: 'ACTIVE', occupancyPercent: 0 },
      { id: 'c4-b', sectionName: 'Section B', className: 'Class 4', classTeacher: 'Class Teacher', totalStudents: 0, capacity: 40, availableSeats: 40, boysCount: 0, girlsCount: 0, feeDefaultersCount: 0, status: 'ACTIVE', occupancyPercent: 0 },
    ],
  },
  {
    id: 'class-5',
    className: 'Class 5',
    displayOrder: 7,
    totalSections: 2,
    totalStudents: 0,
    capacity: 80,
    availableSeats: 80,
    academicYear: '2026-2027',
    occupancyPercent: 0,
    sections: [
      { id: 'c5-a', sectionName: 'Section A', className: 'Class 5', classTeacher: 'Class Teacher', totalStudents: 0, capacity: 40, availableSeats: 40, boysCount: 0, girlsCount: 0, feeDefaultersCount: 0, status: 'ACTIVE', occupancyPercent: 0 },
      { id: 'c5-b', sectionName: 'Section B', className: 'Class 5', classTeacher: 'Class Teacher', totalStudents: 0, capacity: 40, availableSeats: 40, boysCount: 0, girlsCount: 0, feeDefaultersCount: 0, status: 'ACTIVE', occupancyPercent: 0 },
    ],
  },
  {
    id: 'class-6',
    className: 'Class 6',
    displayOrder: 8,
    totalSections: 2,
    totalStudents: 0,
    capacity: 80,
    availableSeats: 80,
    academicYear: '2026-2027',
    occupancyPercent: 0,
    sections: [
      { id: 'c6-a', sectionName: 'Section A', className: 'Class 6', classTeacher: 'Class Teacher', totalStudents: 0, capacity: 40, availableSeats: 40, boysCount: 0, girlsCount: 0, feeDefaultersCount: 0, status: 'ACTIVE', occupancyPercent: 0 },
      { id: 'c6-b', sectionName: 'Section B', className: 'Class 6', classTeacher: 'Class Teacher', totalStudents: 0, capacity: 40, availableSeats: 40, boysCount: 0, girlsCount: 0, feeDefaultersCount: 0, status: 'ACTIVE', occupancyPercent: 0 },
    ],
  },
  {
    id: 'class-7',
    className: 'Class 7',
    displayOrder: 9,
    totalSections: 2,
    totalStudents: 0,
    capacity: 80,
    availableSeats: 80,
    academicYear: '2026-2027',
    occupancyPercent: 0,
    sections: [
      { id: 'c7-a', sectionName: 'Section A', className: 'Class 7', classTeacher: 'Class Teacher', totalStudents: 0, capacity: 40, availableSeats: 40, boysCount: 0, girlsCount: 0, feeDefaultersCount: 0, status: 'ACTIVE', occupancyPercent: 0 },
      { id: 'c7-b', sectionName: 'Section B', className: 'Class 7', classTeacher: 'Class Teacher', totalStudents: 0, capacity: 40, availableSeats: 40, boysCount: 0, girlsCount: 0, feeDefaultersCount: 0, status: 'ACTIVE', occupancyPercent: 0 },
    ],
  },
  {
    id: 'class-8',
    className: 'Class 8',
    displayOrder: 10,
    totalSections: 2,
    totalStudents: 0,
    capacity: 80,
    availableSeats: 80,
    academicYear: '2026-2027',
    occupancyPercent: 0,
    sections: [
      { id: 'c8-a', sectionName: 'Section A', className: 'Class 8', classTeacher: 'Class Teacher', totalStudents: 0, capacity: 40, availableSeats: 40, boysCount: 0, girlsCount: 0, feeDefaultersCount: 0, status: 'ACTIVE', occupancyPercent: 0 },
      { id: 'c8-b', sectionName: 'Section B', className: 'Class 8', classTeacher: 'Class Teacher', totalStudents: 0, capacity: 40, availableSeats: 40, boysCount: 0, girlsCount: 0, feeDefaultersCount: 0, status: 'ACTIVE', occupancyPercent: 0 },
    ],
  },
  {
    id: 'class-9',
    className: 'Class 9',
    displayOrder: 11,
    totalSections: 2,
    totalStudents: 0,
    capacity: 80,
    availableSeats: 80,
    academicYear: '2026-2027',
    occupancyPercent: 0,
    sections: [
      { id: 'c9-a', sectionName: 'Section A', className: 'Class 9', classTeacher: 'Class Teacher', totalStudents: 0, capacity: 40, availableSeats: 40, boysCount: 0, girlsCount: 0, feeDefaultersCount: 0, status: 'ACTIVE', occupancyPercent: 0 },
      { id: 'c9-b', sectionName: 'Section B', className: 'Class 9', classTeacher: 'Class Teacher', totalStudents: 0, capacity: 40, availableSeats: 40, boysCount: 0, girlsCount: 0, feeDefaultersCount: 0, status: 'ACTIVE', occupancyPercent: 0 },
    ],
  },
  {
    id: 'class-10',
    className: 'Class 10',
    displayOrder: 12,
    totalSections: 2,
    totalStudents: 0,
    capacity: 80,
    availableSeats: 80,
    academicYear: '2026-2027',
    occupancyPercent: 0,
    sections: [
      { id: 'c10-a', sectionName: 'Section A', className: 'Class 10', classTeacher: 'Class Teacher', totalStudents: 0, capacity: 40, availableSeats: 40, boysCount: 0, girlsCount: 0, feeDefaultersCount: 0, status: 'ACTIVE', occupancyPercent: 0 },
      { id: 'c10-b', sectionName: 'Section B', className: 'Class 10', classTeacher: 'Class Teacher', totalStudents: 0, capacity: 40, availableSeats: 40, boysCount: 0, girlsCount: 0, feeDefaultersCount: 0, status: 'ACTIVE', occupancyPercent: 0 },
    ],
  },
];
