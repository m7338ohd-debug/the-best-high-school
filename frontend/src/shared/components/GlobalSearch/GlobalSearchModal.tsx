import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  X, 
  GraduationCap, 
  DollarSign, 
  FileText, 
  School, 
  MessageSquare, 
  Settings, 
  Receipt, 
  Command, 
  CornerDownLeft,
  PieChart
} from 'lucide-react';
import { getStoredStudents, getStoredFeePayments } from '../../utils/schoolDataStorage';
import styles from './GlobalSearchModal.module.css';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

interface SearchResultItem {
  id: string;
  category: 'MODULE' | 'STUDENT' | 'RECEIPT' | 'REPORT';
  title: string;
  subtitle: string;
  badge?: string;
  badgeType?: 'purple' | 'green' | 'amber' | 'blue';
  icon: React.ReactNode;
  actionPath: string;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Master Data Sources
  const storedStudents = useMemo(() => getStoredStudents(), [isOpen]);
  const storedPayments = useMemo(() => getStoredFeePayments(), [isOpen]);

  // Unified Search Results Aggregator
  const searchResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const results: SearchResultItem[] = [];

    // 1. Navigation Pages & Modules
    const modules = [
      { label: 'School Dashboard', path: '/app/dashboard', icon: <School size={16} /> },
      { label: 'Student Directory', path: '/app/students', icon: <GraduationCap size={16} /> },
      { label: 'Accountant Terminal', path: '/app/finance', icon: <DollarSign size={16} /> },
      { label: 'Parent Communication', path: '/app/communication', icon: <MessageSquare size={16} /> },
      { label: 'Reports & Compliance', path: '/app/reports', icon: <FileText size={16} /> },
      { label: 'School Settings', path: '/app/settings', icon: <Settings size={16} /> },
    ];

    modules.forEach((mod) => {
      if (mod.label.toLowerCase().includes(q)) {
        results.push({
          id: `mod-${mod.path}`,
          category: 'MODULE',
          title: mod.label,
          subtitle: 'Application Module & Page Navigation',
          badge: 'MODULE',
          badgeType: 'purple',
          icon: mod.icon,
          actionPath: mod.path,
        });
      }
    });

    // 2. Finance Reports
    const reports = [
      { label: 'Daily Collection Report', sub: 'Today\'s fee receipts & cash logs', path: '/app/reports' },
      { label: 'Monthly Collection Report', sub: 'Monthly revenue trajectory & targets', path: '/app/reports' },
      { label: 'Due Fee Defaulters Report', sub: 'Pending student dues & overdue lists', path: '/app/reports' },
      { label: 'Class-Wise Fee Report', sub: 'Fee collection breakdown by grade', path: '/app/reports' },
      { label: 'Balance Statement', sub: 'Student fee balance summary', path: '/app/reports' },
    ];

    reports.forEach((rep) => {
      if (rep.label.toLowerCase().includes(q) || rep.sub.toLowerCase().includes(q)) {
        results.push({
          id: `rep-${rep.label}`,
          category: 'REPORT',
          title: rep.label,
          subtitle: rep.sub,
          badge: 'REPORT',
          badgeType: 'blue',
          icon: <PieChart size={16} />,
          actionPath: rep.path,
        });
      }
    });

    // 3. Students Roster
    storedStudents.forEach((s) => {
      if (
        s.studentName.toLowerCase().includes(q) ||
        s.admissionNo.toLowerCase().includes(q) ||
        s.rollNo?.toLowerCase().includes(q) ||
        s.className.toLowerCase().includes(q) ||
        s.parentName.toLowerCase().includes(q) ||
        s.contact.includes(q)
      ) {
        results.push({
          id: `std-${s.id}`,
          category: 'STUDENT',
          title: s.studentName,
          subtitle: `Adm: ${s.admissionNo} • ${s.className}-${s.sectionName} • Parent: ${s.parentName} (${s.contact})`,
          badge: s.feeStatus === 'Paid' ? 'PAID' : 'DUE',
          badgeType: s.feeStatus === 'Paid' ? 'green' : 'amber',
          icon: <GraduationCap size={16} />,
          actionPath: '/app/students',
        });
      }
    });

    // 4. Fee Receipts & Payments
    storedPayments.forEach((p) => {
      if (
        p.receiptNo.toLowerCase().includes(q) ||
        p.studentName.toLowerCase().includes(q) ||
        p.amountPaid.toString().includes(q)
      ) {
        results.push({
          id: `pay-${p.id}`,
          category: 'RECEIPT',
          title: `Receipt #${p.receiptNo}`,
          subtitle: `Paid: ₹${p.amountPaid.toLocaleString('en-IN')} by ${p.studentName} (${p.className}-${p.sectionName}) via ${p.paymentChannel || 'CASH'}`,
          badge: `₹${p.amountPaid}`,
          badgeType: 'green',
          icon: <Receipt size={16} />,
          actionPath: '/app/finance',
        });
      }
    });

    return results;
  }, [query, storedStudents, storedPayments]);

  // Keyboard navigation inside modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (searchResults.length > 0 ? (prev + 1) % searchResults.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (searchResults.length > 0 ? (prev - 1 + searchResults.length) % searchResults.length : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (searchResults[selectedIndex]) {
          onNavigate(searchResults[selectedIndex].actionPath);
          onClose();
          setQuery('');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, searchResults, selectedIndex, onNavigate, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        
        {/* SEARCH INPUT BAR */}
        <div className={styles.inputBar}>
          <Search size={20} className={styles.searchIcon} />
          <input
            ref={inputRef}
            type="text"
            className={styles.searchInput}
            placeholder="Search students, receipts, classes, fee reports, or pages..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          {query ? (
            <button className={styles.clearBtn} onClick={() => setQuery('')}>
              <X size={16} />
            </button>
          ) : (
            <div className={styles.cmdBadge}>
              <Command size={12} /> K
            </div>
          )}
        </div>

        {/* SEARCH RESULTS LIST */}
        <div className={styles.resultsContainer}>
          {!query.trim() ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>Quick Universal Search</p>
              <p className={styles.emptySub}>Type a student name, admission code, fee receipt #, report title, or page name</p>
              <div className={styles.quickTags}>
                <span onClick={() => setQuery('Class 5')}>Class 5</span>
                <span onClick={() => setQuery('REC-2026')}>Fee Receipts</span>
                <span onClick={() => setQuery('Report')}>Reports</span>
                <span onClick={() => setQuery('Student')}>Students</span>
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className={styles.noResults}>
              No records found matching "<strong>{query}</strong>" across students, receipts, or reports.
            </div>
          ) : (
            <div className={styles.resultsList}>
              {searchResults.map((item, idx) => (
                <div
                  key={item.id}
                  className={`${styles.resultRow} ${idx === selectedIndex ? styles.activeRow : ''}`}
                  onClick={() => {
                    onNavigate(item.actionPath);
                    onClose();
                    setQuery('');
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <div className={styles.iconBox}>{item.icon}</div>

                  <div className={styles.itemMeta}>
                    <div className={styles.itemTitleRow}>
                      <span className={styles.itemTitle}>{item.title}</span>
                      {item.badge && (
                        <span className={`${styles.badge} ${styles[item.badgeType || 'purple']}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className={styles.itemSubtitle}>{item.subtitle}</span>
                  </div>

                  <div className={styles.actionPrompt}>
                    <span>Open</span>
                    <CornerDownLeft size={14} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MODAL FOOTER BAR */}
        <div className={styles.footerBar}>
          <div className={styles.shortcutGuide}>
            <span><kbd>↑</kbd> <kbd>↓</kbd> Navigate</span>
            <span><kbd>↵</kbd> Select</span>
            <span><kbd>ESC</kbd> Close</span>
          </div>
          <span className={styles.hitCount}>{searchResults.length} Results Found</span>
        </div>

      </div>
    </div>
  );
};
