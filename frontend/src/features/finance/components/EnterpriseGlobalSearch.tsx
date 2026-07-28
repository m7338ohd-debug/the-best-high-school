import React, { useState, useEffect, useRef } from 'react';
import { StudentFinancialProfile } from '../types/finance.types';
import { Search, Command, ArrowRight } from 'lucide-react';
import styles from './EnterpriseGlobalSearch.module.css';

interface EnterpriseGlobalSearchProps {
  students: StudentFinancialProfile[];
  onSelectStudent: (student: StudentFinancialProfile) => void;
}

export const EnterpriseGlobalSearch: React.FC<EnterpriseGlobalSearchProps> = ({
  students,
  onSelectStudent,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced Filtered Results
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
    : [];

  // Keyboard navigation listener (Ctrl+S or Cmd+S to focus)
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
            setQuery('');
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onSelectStudent]);

  return (
    <div className={styles.container}>
      <div className={styles.searchWrapper}>
        <Search size={20} className={styles.searchIcon} />
        <input
          ref={inputRef}
          type="text"
          className={styles.searchInput}
          placeholder="Global Enterprise Search (Admission No, Name, Parent Name, Mobile, Roll No - Press Ctrl+S)..."
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

      {/* DROPDOWN RESULTS (DUPLICATE NAME PROOF) */}
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
                  setQuery('');
                }}
              >
                <img
                  src={s.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={s.studentName}
                  className={styles.avatarImg}
                />
                
                <div className={styles.resultInfo}>
                  <div className={styles.nameRow}>
                    <strong className={styles.studentName}>{s.studentName}</strong>
                    <code className={styles.admCode}>{s.admissionNo}</code>
                    <span className={styles.rollBadge}>Roll #{s.rollNo}</span>
                  </div>

                  <div className={styles.metaRow}>
                    <span>Class: <strong>{s.className} ({s.sectionName})</strong></span>
                    <span className={styles.dot}>•</span>
                    <span>Parent: <strong>{s.parentName} ({s.contact})</strong></span>
                  </div>
                </div>

                <div className={styles.resultRight}>
                  <span className={`${styles.balBadge} ${s.outstandingBalance > 0 ? styles.balDue : styles.balPaid}`}>
                    {s.outstandingBalance > 0 ? `₹${s.outstandingBalance.toLocaleString('en-IN')} Due` : 'FULLY PAID'}
                  </span>
                  <ArrowRight size={16} className={styles.arrowIcon} />
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noResult}>No matching student records found across the entire school.</div>
          )}
        </div>
      )}
    </div>
  );
};
