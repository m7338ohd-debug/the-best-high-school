import React, { useState } from 'react';
import { StudentFinancialProfile, ClassSummaryCard } from '../types/finance.types';
import { ArrowLeft, Search, Sparkles, DollarSign } from 'lucide-react';
import styles from './ClassCollectionWorkspace.module.css';

interface ClassCollectionWorkspaceProps {
  selectedClass: ClassSummaryCard;
  students: StudentFinancialProfile[];
  onBackToDashboard: () => void;
  onSelectStudent: (student: StudentFinancialProfile) => void;
}

export const ClassCollectionWorkspace: React.FC<ClassCollectionWorkspaceProps> = ({
  selectedClass,
  students,
  onBackToDashboard,
  onSelectStudent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const normalizeClass = (name: string) => {
    if (!name) return '';
    return name.trim().toLowerCase().replace(/^(class|grade)\s*/i, '');
  };

  // 1. Direct matching students from real stored roster
  const generatedRoster: StudentFinancialProfile[] = students.filter(
    (s) => normalizeClass(s.className) === normalizeClass(selectedClass.className)
  );


  const filtered = generatedRoster.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.studentName.toLowerCase().includes(q) ||
      s.admissionNo.toLowerCase().includes(q) ||
      s.rollNo.includes(q) ||
      s.parentName.toLowerCase().includes(q)
    );
  });

  return (
    <div className={styles.container}>
      {/* HEADER & BREADCRUMB */}
      <header className={styles.header}>
        <div>
          <div className={styles.breadcrumb}>
            <button className={styles.backLink} onClick={onBackToDashboard}>
              <ArrowLeft size={14} /> Back to Dashboard
            </button>
            <span className={styles.breadDivider}>/</span>
            <span className={styles.breadCurrent}>{selectedClass.className} Collection Workspace</span>
          </div>

          <span className={styles.badgePurple}>
            <Sparkles size={14} /> Class Collection Workspace (Merged Sections)
          </span>
          <h1 className={styles.title}>{selectedClass.className} Student Fee Ledger Roster</h1>
          <p className={styles.subtitle}>
            Merged roster for {selectedClass.totalStudents} students across all sections in {selectedClass.className}
          </p>
        </div>

        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder={`Search ${selectedClass.className} students (Name, Admission No, Parent)...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {/* MERGED STUDENT CARDS LIST */}
      <div className={styles.studentGrid}>
        {filtered.map((student) => {
          const isPaid = student.feeStatus === 'Paid';
          const isPartial = student.feeStatus === 'Partially Paid';

          return (
            <div
              key={student.id}
              className={styles.studentCard}
              onClick={() => onSelectStudent(student)}
            >
              <div className={styles.cardHeader}>
                <img
                  src={student.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={student.studentName}
                  className={styles.avatarImg}
                />
                <div>
                  <h3 className={styles.studentName}>{student.studentName}</h3>
                  <div className={styles.admRow}>
                    <code className={styles.admCode}>{student.admissionNo}</code>
                    <span className={styles.sectionBadge}>Sec {student.sectionName} • Roll #{student.rollNo}</span>
                  </div>
                </div>
              </div>

              <div className={styles.parentRow}>
                <span className={styles.parentLabel}>Parent / Guardian:</span>
                <strong className={styles.parentVal}>{student.parentName} ({student.contact})</strong>
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.balBox}>
                  <span className={styles.balLabel}>Outstanding Dues</span>
                  <strong className={student.outstandingBalance > 0 ? styles.balRed : styles.balGreen}>
                    ₹{student.outstandingBalance.toLocaleString('en-IN')}
                  </strong>
                </div>

                <span className={`${styles.statusBadge} ${
                  isPaid ? styles.statusGreen : isPartial ? styles.statusYellow : styles.statusRed
                }`}>
                  {student.feeStatus}
                </span>
              </div>

              <button className={styles.inspectBtn}>
                <DollarSign size={14} /> Open Finance Profile
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
