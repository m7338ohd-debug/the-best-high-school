import React, { useState, useEffect, useRef } from 'react';
import { StudentFinancialProfile } from '../types/finance.types';
import { Search, ArrowRight, Command } from 'lucide-react';
import styles from './StudentSearchTerminal.module.css';

interface StudentSearchTerminalProps {
  students: StudentFinancialProfile[];
  onSelectStudent: (student: StudentFinancialProfile) => void;
  activeStudent: StudentFinancialProfile | null;
}

export const StudentSearchTerminal: React.FC<StudentSearchTerminalProps> = ({
  students,
  onSelectStudent,
  activeStudent,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? students.filter((s) => {
      const q = query.toLowerCase();
      return (
        s.studentName.toLowerCase().includes(q) ||
        s.admissionNo.toLowerCase().includes(q) ||
        s.rollNo.includes(q) ||
        s.parentName.toLowerCase().includes(q) ||
        s.contact.includes(q)
      );
    })
    : students;

  // Keyboard Navigation (Ctrl + S to focus search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (isOpen && filtered.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % filtered.length);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (filtered[selectedIndex]) {
            onSelectStudent(filtered[selectedIndex]);
            setIsOpen(false);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onSelectStudent]);

  return (
    <div className={styles.searchTerminalContainer}>
      <div className={styles.terminalHeader}>
        <div className={styles.searchBarWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input
            ref={inputRef}
            type="text"
            className={styles.terminalInput}
            placeholder="Search Admission No, Student Name, Parent Name, Mobile (Press Ctrl+S)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setSelectedIndex(0);
            }}
            onFocus={() => setIsOpen(true)}
          />
          <div className={styles.keyboardBadge}>
            <Command size={12} /> S
          </div>
        </div>

        {/* Live Search Dropdown */}
        {isOpen && query.trim() && (
          <div className={styles.dropdownResults}>
            {filtered.length > 0 ? (
              filtered.map((s, idx) => (
                <div
                  key={s.id}
                  className={`${styles.resultItem} ${idx === selectedIndex ? styles.selectedItem : ''}`}
                  onClick={() => {
                    onSelectStudent(s);
                    setIsOpen(false);
                  }}
                >
                  <img
                    src={s.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={s.studentName}
                    className={styles.avatarImg}
                  />
                  <div className={styles.resultInfo}>
                    <div className={styles.resultNameRow}>
                      <strong>{s.studentName}</strong>
                      <code className={styles.admBadge}>{s.admissionNo}</code>
                    </div>
                    <div className={styles.resultMeta}>
                      <span>{s.className}-{s.sectionName}</span>
                      <span className={styles.dot}>•</span>
                      <span>Parent: {s.parentName} ({s.contact})</span>
                    </div>
                  </div>

                  <div className={styles.resultRight}>
                    <span className={`${styles.balBadge} ${s.outstandingBalance > 0 ? styles.balDue : styles.balZero}`}>
                      ₹{s.outstandingBalance.toLocaleString('en-IN')} Due
                    </span>
                    <ArrowRight size={14} className={styles.arrowIcon} />
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.noResult}>No matching student records found.</div>
            )}
          </div>
        )}
      </div>

      {/* SELECTED STUDENT FINANCIAL SUMMARY CARD */}
      {activeStudent && (
        <div className={styles.studentProfileCard}>
          <div className={styles.profileLeft}>
            <img
              src={activeStudent.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={activeStudent.studentName}
              className={styles.largeAvatar}
            />
            <div>
              <div className={styles.profileHeaderRow}>
                <h2 className={styles.activeName}>{activeStudent.studentName}</h2>
                <span className={styles.activeAdmCode}>{activeStudent.admissionNo}</span>
              </div>
              <p className={styles.activeSub}>
                {activeStudent.className} Section {activeStudent.sectionName} • Academic Year {activeStudent.academicYear}
              </p>
              <div className={styles.guardianRow}>
                <span>Guardian: <strong>{activeStudent.parentName} ({activeStudent.parentRelation})</strong></span>
                <span className={styles.dot}>•</span>
                <span>Mobile: <strong>{activeStudent.contact}</strong></span>
              </div>
            </div>
          </div>

          {/* 8 FINANCIAL CARDS GRID */}
          <div className={styles.financialStatsGrid}>
            <div className={styles.fCard}>
              <span className={styles.fLabel}>Total Term Fees</span>
              <strong className={styles.fVal}>₹{activeStudent.totalFees.toLocaleString('en-IN')}</strong>
            </div>
            <div className={styles.fCard}>
              <span className={styles.fLabel}>Total Amount Paid</span>
              <strong className={styles.fValGreen}>₹{activeStudent.totalPaid.toLocaleString('en-IN')}</strong>
            </div>
            <div className={styles.fCard}>
              <span className={styles.fLabel}>Pending Dues</span>
              <strong className={styles.fValPurple}>₹{(activeStudent.totalPending || 0).toLocaleString('en-IN')}</strong>
            </div>
            <div className={styles.fCard}>
              <span className={styles.fLabel}>Applied Discount</span>
              <strong className={styles.fValBlue}>₹{(activeStudent.totalDiscount || activeStudent.discounts || 0).toLocaleString('en-IN')}</strong>
            </div>
            <div className={styles.fCard}>
              <span className={styles.fLabel}>Scholarship</span>
              <strong className={styles.fValPink}>₹{(activeStudent.totalScholarship || activeStudent.scholarships || 0).toLocaleString('en-IN')}</strong>
            </div>
            <div className={styles.fCard}>
              <span className={styles.fLabel}>Late Fine</span>
              <strong className={styles.fValRed}>₹{(activeStudent.totalLateFine || activeStudent.lateFine || 0).toLocaleString('en-IN')}</strong>
            </div>
            <div className={styles.fCard}>
              <span className={styles.fLabel}>Refund</span>
              <strong className={styles.fValSlate}>₹{(activeStudent.totalRefund || activeStudent.refunds || 0).toLocaleString('en-IN')}</strong>
            </div>
            <div className={styles.fCardHighlight}>
              <span className={styles.fLabelHighlight}>Outstanding Balance</span>
              <strong className={styles.fValHighlight}>₹{activeStudent.outstandingBalance.toLocaleString('en-IN')}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
