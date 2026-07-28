import React, { useState } from 'react';
import { Filter, RotateCcw, Search } from 'lucide-react';
import { Button } from '../ui/Button/Button';
import styles from './FilterPanel.module.css';

export interface FilterState {
  search?: string;
  startDate?: string;
  endDate?: string;
  academicYear?: string;
  status?: string;
  className?: string;
  paymentMode?: string;
  feeCategory?: string;
}

export interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void;
  showAcademicYear?: boolean;
  showStatus?: boolean;
  showClass?: boolean;
  showPaymentMode?: boolean;
  showFeeCategory?: boolean;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  onFilterChange,
  showAcademicYear = true,
  showStatus = true,
  showClass = true,
  showPaymentMode = true,
  showFeeCategory = true,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    startDate: '',
    endDate: '',
    academicYear: '',
    status: '',
    className: '',
    paymentMode: '',
    feeCategory: '',
  });

  const handleChange = (field: keyof FilterState, value: string) => {
    const updated = { ...filters, [field]: value };
    setFilters(updated);
    onFilterChange(updated);
  };

  const handleReset = () => {
    const cleared: FilterState = {
      search: '',
      startDate: '',
      endDate: '',
      academicYear: '',
      status: '',
      className: '',
      paymentMode: '',
      feeCategory: '',
    };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <Filter size={16} className={styles.icon} />
          <span className={styles.title}>Filter Options</span>
        </div>
        <Button variant="ghost" size="sm" leftIcon={<RotateCcw size={14} />} onClick={handleReset}>
          Reset
        </Button>
      </div>

      <div className={styles.grid}>
        {/* Search Text */}
        <div className={styles.filterGroup}>
          <label className={styles.label}>Search Keywords</label>
          <div className={styles.searchWrapper}>
            <Search size={14} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search..."
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
              className={styles.input}
            />
          </div>
        </div>

        {/* Date Range */}
        <div className={styles.filterGroup}>
          <label className={styles.label}>Start Date</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.label}>End Date</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className={styles.input}
          />
        </div>

        {/* Academic Year */}
        {showAcademicYear && (
          <div className={styles.filterGroup}>
            <label className={styles.label}>Academic Year</label>
            <select
              value={filters.academicYear}
              onChange={(e) => handleChange('academicYear', e.target.value)}
              className={styles.select}
            >
              <option value="">All Academic Years</option>
              <option value="2025-2026">2025-2026</option>
              <option value="2026-2027">2026-2027</option>
            </select>
          </div>
        )}

        {/* Status */}
        {showStatus && (
          <div className={styles.filterGroup}>
            <label className={styles.label}>Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className={styles.select}
            >
              <option value="">All Statuses</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="PARTIAL">Partial</option>
              <option value="OVERDUE">Overdue</option>
            </select>
          </div>
        )}

        {/* Class */}
        {showClass && (
          <div className={styles.filterGroup}>
            <label className={styles.label}>Class / Section</label>
            <select
              value={filters.className}
              onChange={(e) => handleChange('className', e.target.value)}
              className={styles.select}
            >
              <option value="">All Classes</option>
              <option value="Grade 8">Grade 8</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 10">Grade 10</option>
              <option value="Grade 11">Grade 11</option>
              <option value="Grade 12">Grade 12</option>
            </select>
          </div>
        )}

        {/* Payment Mode */}
        {showPaymentMode && (
          <div className={styles.filterGroup}>
            <label className={styles.label}>Payment Mode</label>
            <select
              value={filters.paymentMode}
              onChange={(e) => handleChange('paymentMode', e.target.value)}
              className={styles.select}
            >
              <option value="">All Modes</option>
              <option value="CASH">Cash</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="ONLINE_GATEWAY">Online Gateway</option>
              <option value="UPI">UPI</option>
            </select>
          </div>
        )}

        {/* Fee Category */}
        {showFeeCategory && (
          <div className={styles.filterGroup}>
            <label className={styles.label}>Fee Category</label>
            <select
              value={filters.feeCategory}
              onChange={(e) => handleChange('feeCategory', e.target.value)}
              className={styles.select}
            >
              <option value="">All Categories</option>
              <option value="TUITION">Tuition</option>
              <option value="ADMISSION">Admission</option>
              <option value="TRANSPORT">Transport</option>
              <option value="LABORATORY">Laboratory</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
