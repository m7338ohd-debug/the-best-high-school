import React from 'react';
import { StudentFilterState } from '../types/student.types';
import { Filter, RotateCcw, Search } from 'lucide-react';
import styles from './StudentFilterDrawer.module.css';

interface StudentFilterDrawerProps {
  filters: StudentFilterState;
  onChange: (newFilters: StudentFilterState) => void;
  onReset: () => void;
}

export const StudentFilterDrawer: React.FC<StudentFilterDrawerProps> = ({
  filters,
  onChange,
  onReset,
}) => {
  const update = (key: keyof StudentFilterState, val: string) => {
    onChange({ ...filters, [key]: val });
  };

  return (
    <div className={styles.filterCard}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <Filter size={16} className={styles.filterIcon} />
          <h4 className={styles.title}>Enterprise Student Directory Search & Filters</h4>
        </div>
        <button className={styles.resetBtn} onClick={onReset}>
          <RotateCcw size={13} /> Reset All Filters
        </button>
      </div>

      <div className={styles.filterGrid}>
        {/* Search Query */}
        <div className={styles.field}>
          <label className={styles.label}>Quick Search</label>
          <div className={styles.inputWrapper}>
            <Search size={14} className={styles.inputIcon} />
            <input
              type="text"
              className={styles.input}
              placeholder="Search name, admission no, roll no..."
              value={filters.search}
              onChange={(e) => update('search', e.target.value)}
            />
          </div>
        </div>

        {/* Academic Year */}
        <div className={styles.field}>
          <label className={styles.label}>Academic Year</label>
          <select 
            className={styles.select} 
            value={filters.academicYear} 
            onChange={(e) => update('academicYear', e.target.value)}
          >
            <option value="2026-2027">2026-2027 (Current Term)</option>
            <option value="2025-2026">2025-2026</option>
            <option value="2024-2025">2024-2025</option>
          </select>
        </div>

        {/* Class */}
        <div className={styles.field}>
          <label className={styles.label}>Class / Grade</label>
          <select 
            className={styles.select} 
            value={filters.className} 
            onChange={(e) => update('className', e.target.value)}
          >
            <option value="">All Classes</option>
            <option value="LKG">LKG</option>
            <option value="UKG">UKG</option>
            <option value="Grade 1">Grade 1</option>
            <option value="Grade 2">Grade 2</option>
            <option value="Grade 3">Grade 3</option>
            <option value="Grade 4">Grade 4</option>
            <option value="Grade 5">Grade 5</option>
            <option value="Grade 6">Grade 6</option>
            <option value="Grade 7">Grade 7</option>
            <option value="Grade 8">Grade 8</option>
            <option value="Grade 9">Grade 9</option>
            <option value="Grade 10">Grade 10</option>
            <option value="Grade 11">Grade 11</option>
            <option value="Grade 12">Grade 12</option>
          </select>
        </div>

        {/* Section */}
        <div className={styles.field}>
          <label className={styles.label}>Section</label>
          <select 
            className={styles.select} 
            value={filters.sectionName} 
            onChange={(e) => update('sectionName', e.target.value)}
          >
            <option value="">All Sections</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
            <option value="D">Section D</option>
          </select>
        </div>

        {/* Gender */}
        <div className={styles.field}>
          <label className={styles.label}>Gender</label>
          <select 
            className={styles.select} 
            value={filters.gender} 
            onChange={(e) => update('gender', e.target.value)}
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Student Status */}
        <div className={styles.field}>
          <label className={styles.label}>Student Status</label>
          <select 
            className={styles.select} 
            value={filters.status} 
            onChange={(e) => update('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="SUSPENDED">SUSPENDED</option>
            <option value="ALUMNI">ALUMNI</option>
            <option value="GRADUATED">GRADUATED</option>
            <option value="TRANSFERRED">TRANSFERRED</option>
          </select>
        </div>

        {/* Fee Status */}
        <div className={styles.field}>
          <label className={styles.label}>Fee Payment Status</label>
          <select 
            className={styles.select} 
            value={filters.feeStatus} 
            onChange={(e) => update('feeStatus', e.target.value)}
          >
            <option value="">All Fee Statuses</option>
            <option value="Paid">Paid Fees</option>
            <option value="Partial">Partial Payment</option>
            <option value="Pending">Pending Payment</option>
            <option value="Defaulter">Fee Defaulter</option>
          </select>
        </div>

        {/* Admission Date From */}
        <div className={styles.field}>
          <label className={styles.label}>Admission Date From</label>
          <input 
            type="date" 
            className={styles.inputDate} 
            value={filters.admissionDateFrom}
            onChange={(e) => update('admissionDateFrom', e.target.value)}
          />
        </div>

        {/* Admission Date To */}
        <div className={styles.field}>
          <label className={styles.label}>Admission Date To</label>
          <input 
            type="date" 
            className={styles.inputDate} 
            value={filters.admissionDateTo}
            onChange={(e) => update('admissionDateTo', e.target.value)}
          />
        </div>

        {/* Blood Group */}
        <div className={styles.field}>
          <label className={styles.label}>Blood Group</label>
          <select 
            className={styles.select} 
            value={filters.bloodGroup} 
            onChange={(e) => update('bloodGroup', e.target.value)}
          >
            <option value="">All Blood Groups</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </div>

        {/* House */}
        <div className={styles.field}>
          <label className={styles.label}>School House</label>
          <select 
            className={styles.select} 
            value={filters.house} 
            onChange={(e) => update('house', e.target.value)}
          >
            <option value="">All Houses</option>
            <option value="Red House">Red House</option>
            <option value="Blue House">Blue House</option>
            <option value="Green House">Green House</option>
            <option value="Yellow House">Yellow House</option>
          </select>
        </div>

        {/* Transport */}
        <div className={styles.field}>
          <label className={styles.label}>Transport Facility</label>
          <select 
            className={styles.select} 
            value={filters.transport} 
            onChange={(e) => update('transport', e.target.value)}
          >
            <option value="">All Transport Modes</option>
            <option value="School Bus">School Bus</option>
            <option value="Private Transport">Private Transport</option>
            <option value="Self / Walking">Self / Walking</option>
          </select>
        </div>

        {/* Hostel */}
        <div className={styles.field}>
          <label className={styles.label}>Hostel Facility</label>
          <select 
            className={styles.select} 
            value={filters.hostel} 
            onChange={(e) => update('hostel', e.target.value)}
          >
            <option value="">All Residential Types</option>
            <option value="Day Scholar">Day Scholar</option>
            <option value="Hostel Resident">Hostel Resident</option>
          </select>
        </div>
      </div>
    </div>
  );
};
