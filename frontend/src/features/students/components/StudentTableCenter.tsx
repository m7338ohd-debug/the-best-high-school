import React, { useState, useMemo } from 'react';
import { StudentRecord } from '../types/student.types';
import { 
  UserPlus, 
  Users, 
  ArrowUpRight, 
  Download, 
  Upload, 
  Printer, 
  FileCheck, 
  SlidersHorizontal, 
  Layers, 
  Eye, 
  Edit, 
  Sparkles
} from 'lucide-react';
import styles from './StudentTableCenter.module.css';

interface StudentTableCenterProps {
  students: StudentRecord[];
  onSelectStudent: (student: StudentRecord) => void;
  onNewAdmission?: () => void;
  onBulkPromote?: () => void;
}

type DensityMode = 'compact' | 'comfortable' | 'spacious';

export const StudentTableCenter: React.FC<StudentTableCenterProps> = ({
  students,
  onSelectStudent,
  onNewAdmission,
  onBulkPromote,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [density, setDensity] = useState<DensityMode>('comfortable');
  const [sortField, setSortField] = useState<keyof StudentRecord>('studentName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    photo: true,
    admissionNo: true,
    rollNo: true,
    studentName: true,
    className: true,
    sectionName: true,
    gender: true,
    parentName: true,
    contact: true,
    feeStatus: true,
    attendance: true,
    status: true,
    lastUpdated: true,
    actions: true,
  });
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Sorting
  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => {
      const valA = a[sortField] || '';
      const valB = b[sortField] || '';
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [students, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedStudents.length / pageSize) || 1;
  const paginatedStudents = sortedStudents.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (field: keyof StudentRecord) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedStudents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedStudents.map((s) => s.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleColumn = (colKey: string) => {
    setVisibleColumns({ ...visibleColumns, [colKey]: !visibleColumns[colKey] });
  };

  // Export handlers
  const handleExportCSV = () => {
    const csvRows = [
      ['Admission No', 'Roll No', 'Student Name', 'Class', 'Section', 'Gender', 'Parent Name', 'Contact', 'Fee Status', 'Attendance', 'Status'].join(','),
      ...students.map((s) => [
        s.admissionNo, s.rollNo, `"${s.studentName}"`, s.className, s.sectionName, s.gender, `"${s.parentName}"`, s.contact, s.feeStatus, `${s.attendancePercent}%`, s.status
      ].join(','))
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Student_Directory_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className={styles.tableCard}>
      {/* QUICK ACTIONS BAR ABOVE TABLE */}
      <div className={styles.quickActionsBar}>
        <div className={styles.actionLeftGroup}>
          <button className={styles.primaryActionBtn} onClick={onNewAdmission}>
            <UserPlus size={16} />
            <span>Add Student</span>
          </button>
          <button className={styles.actionBtn} onClick={onNewAdmission}>
            <Users size={16} />
            <span>Bulk Admission</span>
          </button>
          <button className={styles.actionBtn} onClick={onBulkPromote}>
            <ArrowUpRight size={16} />
            <span>Promote Students</span>
          </button>
        </div>

        <div className={styles.actionRightGroup}>
          <button className={styles.actionBtn} onClick={handleExportCSV}>
            <Download size={15} />
            <span>Export</span>
          </button>
          <button className={styles.actionBtn} onClick={handleExportCSV}>
            <Upload size={15} />
            <span>Import</span>
          </button>
          <button className={styles.actionBtn} onClick={() => window.print()}>
            <Printer size={15} />
            <span>Print ID Cards</span>
          </button>
          <button className={styles.actionBtn}>
            <FileCheck size={15} />
            <span>Generate Certificates</span>
          </button>
        </div>
      </div>

      {/* TABLE TOOLBAR OPTIONS */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarTitleGroup}>
          <span className={styles.badgePurple}><Sparkles size={13} /> Active Student Roster</span>
          <h3 className={styles.toolbarTitle}>Enrolled Student Directory</h3>
          <span className={styles.recordCount}>{students.length} Records Loaded</span>
        </div>

        <div className={styles.toolbarControls}>
          {/* Column Visibility Selector Toggle */}
          <div className={styles.dropdownWrapper}>
            <button className={styles.controlBtn} onClick={() => setShowColumnSelector(!showColumnSelector)}>
              <SlidersHorizontal size={14} />
              <span>Columns</span>
            </button>
            {showColumnSelector && (
              <div className={styles.columnDropdown}>
                <div className={styles.colHeader}>Toggle Visible Columns</div>
                {Object.keys(visibleColumns).map((col) => (
                  <label key={col} className={styles.colItem}>
                    <input 
                      type="checkbox" 
                      checked={visibleColumns[col]} 
                      onChange={() => toggleColumn(col)} 
                    />
                    <span>{col.replace(/([A-Z])/g, ' $1').toUpperCase()}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Density Toggle */}
          <div className={styles.densityGroup}>
            <button 
              className={`${styles.densityBtn} ${density === 'compact' ? styles.densityActive : ''}`} 
              onClick={() => setDensity('compact')}
              title="Compact Density"
            >
              <Layers size={13} />
            </button>
            <button 
              className={`${styles.densityBtn} ${density === 'comfortable' ? styles.densityActive : ''}`} 
              onClick={() => setDensity('comfortable')}
              title="Comfortable Density"
            >
              <Layers size={15} />
            </button>
            <button 
              className={`${styles.densityBtn} ${density === 'spacious' ? styles.densityActive : ''}`} 
              onClick={() => setDensity('spacious')}
              title="Spacious Density"
            >
              <Layers size={17} />
            </button>
          </div>
        </div>
      </div>

      {/* BULK SELECTION ACTION BAR */}
      {selectedIds.length > 0 && (
        <div className={styles.bulkActionBar}>
          <span>Selected <strong>{selectedIds.length}</strong> Students</span>
          <div className={styles.bulkBtns}>
            <button className={styles.bulkBtn} onClick={onBulkPromote}>Bulk Promote</button>
            <button className={styles.bulkBtn} onClick={() => window.print()}>Print Selected ID Cards</button>
            <button className={styles.bulkBtn} onClick={handleExportCSV}>Export Selected</button>
          </div>
        </div>
      )}

      {/* STICKY HEADER & STICKY FIRST COLUMN DATATABLE */}
      <div className={styles.tableScrollWrapper}>
        <table className={`${styles.table} ${styles[density]}`}>
          <thead>
            <tr>
              <th className={styles.stickyColHeader}>
                <input 
                  type="checkbox" 
                  checked={selectedIds.length === paginatedStudents.length && paginatedStudents.length > 0} 
                  onChange={toggleSelectAll} 
                />
              </th>
              {visibleColumns.photo && <th>Photo</th>}
              {visibleColumns.admissionNo && <th onClick={() => handleSort('admissionNo')}>Admission No {sortField === 'admissionNo' && (sortOrder === 'asc' ? '▲' : '▼')}</th>}
              {visibleColumns.rollNo && <th onClick={() => handleSort('rollNo')}>Roll No</th>}
              {visibleColumns.studentName && <th onClick={() => handleSort('studentName')}>Student Name {sortField === 'studentName' && (sortOrder === 'asc' ? '▲' : '▼')}</th>}
              {visibleColumns.className && <th onClick={() => handleSort('className')}>Class</th>}
              {visibleColumns.sectionName && <th>Section</th>}
              {visibleColumns.gender && <th>Gender</th>}
              {visibleColumns.parentName && <th onClick={() => handleSort('parentName')}>Parent Name</th>}
              {visibleColumns.contact && <th>Emergency Contact</th>}
              {visibleColumns.feeStatus && <th>Fee Status</th>}
              {visibleColumns.attendance && <th>Attendance</th>}
              {visibleColumns.status && <th>Status</th>}
              {visibleColumns.lastUpdated && <th>Last Updated</th>}
              {visibleColumns.actions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedStudents.length > 0 ? (
              paginatedStudents.map((s) => (
                <tr key={s.id} className={styles.row}>
                  <td className={styles.stickyColCell}>
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(s.id)} 
                      onChange={() => toggleSelectOne(s.id)} 
                    />
                  </td>
                  {visibleColumns.photo && (
                    <td>
                      <img 
                        src={s.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'} 
                        alt={s.studentName} 
                        className={styles.avatarPhoto} 
                      />
                    </td>
                  )}
                  {visibleColumns.admissionNo && <td><code className={styles.admCode}>{s.admissionNo}</code></td>}
                  {visibleColumns.rollNo && <td><strong>#{s.rollNo}</strong></td>}
                  {visibleColumns.studentName && (
                    <td>
                      <strong className={styles.studentNameText} onClick={() => onSelectStudent(s)}>
                        {s.studentName}
                      </strong>
                    </td>
                  )}
                  {visibleColumns.className && <td>{s.className}</td>}
                  {visibleColumns.sectionName && <td><span className={styles.secBadge}>{s.sectionName}</span></td>}
                  {visibleColumns.gender && <td>{s.gender}</td>}
                  {visibleColumns.parentName && <td>{s.parentName} ({s.parentRelation || 'Father'})</td>}
                  {visibleColumns.contact && <td><code>{s.contact}</code></td>}
                  {visibleColumns.feeStatus && (
                    <td>
                      <span className={`${styles.feeBadge} ${
                        s.feeStatus === 'Paid' ? styles.feePaid :
                        s.feeStatus === 'Partial' ? styles.feePartial : styles.feeDefaulter
                      }`}>
                        {s.feeStatus}
                      </span>
                    </td>
                  )}
                  {visibleColumns.attendance && (
                    <td><span className={styles.attBadge}>{s.attendancePercent}%</span></td>
                  )}
                  {visibleColumns.status && (
                    <td>
                      <span className={`${styles.statusBadge} ${s.status === 'ACTIVE' ? styles.statusActive : styles.statusInactive}`}>
                        {s.status}
                      </span>
                    </td>
                  )}
                  {visibleColumns.lastUpdated && <td>{s.lastUpdated}</td>}
                  {visibleColumns.actions && (
                    <td>
                      <div className={styles.actionRow}>
                        <button className={styles.iconActionBtn} onClick={() => onSelectStudent(s)} title="View Student Profile">
                          <Eye size={14} />
                        </button>
                        <button className={styles.iconActionBtn} title="Edit Student Record">
                          <Edit size={14} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={15} className={styles.emptyCell}>
                  No student records found matching active filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION FOOTER */}
      <div className={styles.paginationFooter}>
        <span className={styles.pageInfo}>
          Showing <strong>{(page - 1) * pageSize + 1}</strong> to <strong>{Math.min(page * pageSize, sortedStudents.length)}</strong> of <strong>{sortedStudents.length}</strong> Students
        </span>

        <div className={styles.pageBtns}>
          <button 
            className={styles.pageNavBtn} 
            disabled={page === 1} 
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`${styles.pageNumberBtn} ${page === i + 1 ? styles.pageActive : ''}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button 
            className={styles.pageNavBtn} 
            disabled={page === totalPages} 
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
