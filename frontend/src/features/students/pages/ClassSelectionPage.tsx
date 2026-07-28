import React, { useState, useEffect } from 'react';
import { ClassModel, mockClassesData } from '../data/classSectionMockData';
import { 
  getStoredStudents, 
  getStoredClassCapacities 
} from '../../../shared/utils/schoolDataStorage';
import { 
  GraduationCap, 
  Search, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Calendar, 
  ArrowLeft 
} from 'lucide-react';
import styles from './ClassSelectionPage.module.css';

interface ClassSelectionPageProps {
  onSelectClass: (cls: ClassModel) => void;
  onBackToDirectory?: () => void;
}

export const ClassSelectionPage: React.FC<ClassSelectionPageProps> = ({
  onSelectClass,
  onBackToDirectory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const selectedAcademicYear = '2026-2027';

  // Real Storage States
  const [storedStudents, setStoredStudents] = useState(getStoredStudents());
  const [classCapacities, setClassCapacities] = useState<Record<string, number>>(getStoredClassCapacities());

  useEffect(() => {
    setStoredStudents(getStoredStudents());
    setClassCapacities(getStoredClassCapacities());
  }, []);

  const normalizeClass = (name: string) => {
    if (!name) return '';
    return name.trim().toLowerCase().replace(/^(class|grade)\s*/i, '');
  };

  const filteredClasses = mockClassesData.filter((c) =>
    c.className.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      {/* Top Header & Breadcrumbs */}
      <header className={styles.header}>
        <div>
          <div className={styles.breadcrumb}>
            <button className={styles.backLink} onClick={onBackToDirectory}>
              <ArrowLeft size={14} /> Student Directory
            </button>
            <span className={styles.breadDivider}>/</span>
            <span className={styles.breadCurrent}>Student Admission Center</span>
          </div>

          <span className={styles.badgePurple}>
            <Sparkles size={14} /> Step 1 of 3: Class Selection
          </span>
          <h1 className={styles.title}>Student Admission Center</h1>
          <p className={styles.subtitle}>Select target academic class to inspect sections and enroll new students</p>
        </div>

        <div className={styles.headerControls}>
          <div className={styles.searchBox}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search class (e.g. Class 5, LKG)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.yearPill}>
            <Calendar size={14} />
            <span>Academic Year: <strong>{selectedAcademicYear}</strong></span>
          </div>
        </div>
      </header>

      {/* Class Cards Grid */}
      <div className={styles.classGrid}>
        {filteredClasses.map((cls) => {
          // Dynamic calculation from real stored student records
          const realEnrolled = storedStudents.filter(
            (s) => normalizeClass(s.className) === normalizeClass(cls.className)
          ).length;

          const realCapacity = classCapacities[cls.className] || cls.capacity || 80;
          const realAvailable = Math.max(0, realCapacity - realEnrolled);
          const realOccupancy = realCapacity > 0 ? (realEnrolled / realCapacity) * 100 : 0;
          const isFull = realAvailable <= 0;

          const updatedCls: ClassModel = {
            ...cls,
            totalStudents: realEnrolled,
            capacity: realCapacity,
            availableSeats: realAvailable,
            occupancyPercent: realOccupancy,
          };

          return (
            <div 
              key={cls.id} 
              className={styles.classCard} 
              onClick={() => onSelectClass(updatedCls)}
            >
              <div className={styles.cardTop}>
                <div className={styles.classIconBadge}>
                  <GraduationCap size={22} />
                </div>
                <span className={`${styles.statusPill} ${isFull ? styles.statusFull : styles.statusActive}`}>
                  {isFull ? 'FULL CAPACITY' : `${realAvailable} SEATS OPEN`}
                </span>
              </div>

              <div className={styles.cardMain}>
                <h3 className={styles.className}>{cls.className}</h3>
                <span className={styles.sectionCount}>
                  <Layers size={13} /> {cls.totalSections} Sections (A, B, C...)
                </span>
              </div>

              {/* Occupancy Progress Bar */}
              <div className={styles.progressContainer}>
                <div className={styles.progressHeader}>
                  <span className={styles.progLabel}>Occupancy</span>
                  <strong className={styles.progVal}>{realOccupancy.toFixed(1)}%</strong>
                </div>
                <div className={styles.progTrack}>
                  <div 
                    className={styles.progFill} 
                    style={{ 
                      width: `${Math.min(realOccupancy, 100)}%`,
                      backgroundColor: isFull ? '#ef4444' : '#7e22ce'
                    }} 
                  />
                </div>
              </div>

              {/* Stats Footer Grid */}
              <div className={styles.cardStatsGrid}>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Enrolled</span>
                  <strong className={styles.statVal}>{realEnrolled}</strong>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Capacity</span>
                  <strong className={styles.statVal}>{realCapacity}</strong>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Available</span>
                  <strong className={styles.statValGreen}>{realAvailable}</strong>
                </div>
              </div>

              {/* Action Button */}
              <button className={styles.openSectionsBtn}>
                <span>Open Sections</span>
                <ArrowRight size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
