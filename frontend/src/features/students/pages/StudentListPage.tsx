import React, { useState, useEffect, useMemo } from 'react';
import { StudentKpiGrid } from '../components/StudentKpiGrid';
import { QuickSummaryCards } from '../components/QuickSummaryCards';
import { StudentAnalyticsGrid } from '../components/StudentAnalyticsGrid';
import { RecentAdmissionsWidget } from '../components/RecentAdmissionsWidget';
import { StudentFilterDrawer } from '../components/StudentFilterDrawer';
import { StudentTableCenter } from '../components/StudentTableCenter';
import { StudentProfileModal } from '../components/StudentProfileModal';

import { ClassSelectionPage } from './ClassSelectionPage';
import { SectionSelectionPage } from './SectionSelectionPage';
import { StudentAdmissionWizardPage } from './StudentAdmissionWizardPage';

import { getStoredStudents } from '../../../shared/utils/schoolDataStorage';
import { ClassModel, mockClassesData } from '../data/classSectionMockData';
import { StudentRecord, StudentFilterState } from '../types/student.types';
import { Sparkles, UserPlus, ArrowUpRight, Filter } from 'lucide-react';
import styles from './StudentListPage.module.css';

export interface StudentListPageProps {
  onNewAdmission?: () => void;
  onBulkPromote?: () => void;
}

type FlowViewMode = 'directory' | 'class-selection' | 'section-selection' | 'admission-wizard';

export const StudentListPage: React.FC<StudentListPageProps> = ({
  onBulkPromote,
}) => {
  const [viewMode, setViewMode] = useState<FlowViewMode>('directory');
  const [selectedClass, setSelectedClass] = useState<ClassModel | null>(mockClassesData[6]); // Default Class 5
  const [selectedSectionName, setSelectedSectionName] = useState<string>('Section A');
  const [students, setStudents] = useState<StudentRecord[]>(getStoredStudents());
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setStudents(getStoredStudents());
  }, [viewMode]);

  // Filter State
  const [filters, setFilters] = useState<StudentFilterState>({
    search: '',
    academicYear: '2026-2027',
    className: '',
    sectionName: '',
    gender: '',
    status: '',
    feeStatus: '',
    admissionDateFrom: '',
    admissionDateTo: '',
    bloodGroup: '',
    house: '',
    transport: '',
    hostel: '',
  });

  const resetFilters = () => {
    setFilters({
      search: '',
      academicYear: '2026-2027',
      className: '',
      sectionName: '',
      gender: '',
      status: '',
      feeStatus: '',
      admissionDateFrom: '',
      admissionDateTo: '',
      bloodGroup: '',
      house: '',
      transport: '',
      hostel: '',
    });
  };

  // Filter Logic
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const match = 
          s.studentName.toLowerCase().includes(q) ||
          s.admissionNo.toLowerCase().includes(q) ||
          s.rollNo.toLowerCase().includes(q) ||
          s.parentName.toLowerCase().includes(q) ||
          s.contact.includes(q);
        if (!match) return false;
      }

      if (filters.className && s.className !== filters.className) return false;
      if (filters.sectionName && s.sectionName !== filters.sectionName) return false;
      if (filters.gender && s.gender !== filters.gender) return false;
      if (filters.status && s.status !== filters.status) return false;
      if (filters.feeStatus && s.feeStatus !== filters.feeStatus) return false;
      if (filters.bloodGroup && s.bloodGroup !== filters.bloodGroup) return false;
      if (filters.house && s.house !== filters.house) return false;
      if (filters.transport && s.transport !== filters.transport) return false;
      if (filters.hostel && s.hostel !== filters.hostel) return false;

      if (filters.admissionDateFrom && s.admissionDate < filters.admissionDateFrom) return false;
      if (filters.admissionDateTo && s.admissionDate > filters.admissionDateTo) return false;

      return true;
    });
  }, [students, filters]);

  // Aggregate KPI Calculations
  const totalCount = filteredStudents.length;
  const boysCount = filteredStudents.filter((s) => s.gender === 'Male').length;
  const girlsCount = filteredStudents.filter((s) => s.gender === 'Female').length;
  const activeCount = filteredStudents.filter((s) => s.status === 'ACTIVE').length;
  const inactiveCount = filteredStudents.filter((s) => s.status !== 'ACTIVE').length;
  const defaultersCount = filteredStudents.filter((s) => s.feeStatus === 'Defaulter').length;

  // VIEW 1: PAGE 1 CLASS SELECTION
  if (viewMode === 'class-selection') {
    return (
      <ClassSelectionPage
        onBackToDirectory={() => setViewMode('directory')}
        onSelectClass={(cls) => {
          setSelectedClass(cls);
          setViewMode('section-selection');
        }}
      />
    );
  }

  // VIEW 2: PAGE 2 SECTION SELECTION & DASHBOARD
  if (viewMode === 'section-selection' && selectedClass) {
    return (
      <SectionSelectionPage
        selectedClass={selectedClass}
        onBackToClasses={() => setViewMode('class-selection')}
        onOpenAdmissionWizard={(_clsName, secName) => {
          setSelectedSectionName(secName);
          setViewMode('admission-wizard');
        }}
        onSelectStudent={(student) => setSelectedStudent(student)}
        mockStudents={students}
      />
    );
  }

  // VIEW 3: PAGE 3 PREFILLED ADMISSION WIZARD
  if (viewMode === 'admission-wizard' && selectedClass) {
    return (
      <StudentAdmissionWizardPage
        initialClass={selectedClass.className}
        initialSection={selectedSectionName}
        academicYear={selectedClass.academicYear}
        onBack={() => setViewMode('section-selection')}
        onComplete={() => {
          setStudents(getStoredStudents());
          setViewMode('section-selection');
        }}
      />
    );
  }

  // VIEW 4: DEFAULT EXECUTIVE STUDENT DIRECTORY DASHBOARD
  return (
    <div className={styles.container}>
      {/* PAGE HEADER */}
      <header className={styles.header}>
        <div>
          <span className={styles.headerBadge}>
            <Sparkles size={14} /> Enterprise Student ERP & Analytics Center
          </span>
          <h1 className={styles.title}>Student Directory & Analytics Dashboard</h1>
          <p className={styles.subtitle}>Real-time enrollment analytics, gender ratios, fee tracking, and master student roster</p>
        </div>

        <div className={styles.headerActions}>
          <button 
            className={`${styles.filterToggleBtn} ${showFilters ? styles.filterActive : ''}`} 
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={15} />
            <span>{showFilters ? 'Hide Filters' : 'Advanced Filters'}</span>
          </button>
          
          <button className={styles.secBtn} onClick={onBulkPromote}>
            <ArrowUpRight size={15} />
            <span>Bulk Promotion</span>
          </button>

          <button className={styles.priBtn} onClick={() => setViewMode('class-selection')}>
            <UserPlus size={15} />
            <span>Add Student (Class → Section)</span>
          </button>
        </div>
      </header>

      {/* COMPREHENSIVE FILTER DRAWER (WHEN TOGGLED) */}
      {showFilters && (
        <StudentFilterDrawer
          filters={filters}
          onChange={(newFilters) => setFilters(newFilters)}
          onReset={resetFilters}
        />
      )}

      {/* ROW 1: 6 KPI CARDS */}
      <StudentKpiGrid
        totalStudents={totalCount}
        boysCount={boysCount}
        girlsCount={girlsCount}
        activeCount={activeCount}
        inactiveCount={inactiveCount}
        defaultersCount={defaultersCount}
      />

      {/* ROW 2: QUICK SUMMARY CARDS */}
      <QuickSummaryCards students={students} />

      {/* ROW 3: ANALYTICS SECTION (4 MODERN INTERACTIVE CHARTS) */}
      <StudentAnalyticsGrid students={students} />

      {/* ROW 4: RECENT ADMISSIONS FEED */}
      <RecentAdmissionsWidget
        students={filteredStudents}
        onSelectStudent={(student) => setSelectedStudent(student)}
      />

      {/* ROW 5: MASTER STUDENT DIRECTORY TABLE */}
      <StudentTableCenter
        students={filteredStudents}
        onSelectStudent={(student) => setSelectedStudent(student)}
        onNewAdmission={() => setViewMode('class-selection')}
        onBulkPromote={onBulkPromote}
      />

      {/* INTERACTIVE STUDENT PROFILE MODAL */}
      <StudentProfileModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onUpdateStudent={(updated) => {
          setSelectedStudent(updated);
          setStudents(getStoredStudents());
        }}
      />
    </div>
  );
};
