import React, { useState, useEffect } from 'react';
import { ClassModel, SectionModel } from '../data/classSectionMockData';
import { StudentRecord } from '../types/student.types';
import { 
  getStoredStudents, 
  getStoredClassCapacities, 
  saveClassCapacityToStorage 
} from '../../../shared/utils/schoolDataStorage';
import { 
  Users, 
  DollarSign, 
  UserPlus, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Eye, 
  Plus,
  X,
  Edit2,
  Check
} from 'lucide-react';
import styles from './SectionSelectionPage.module.css';

interface SectionSelectionPageProps {
  selectedClass: ClassModel;
  onBackToClasses: () => void;
  onOpenAdmissionWizard: (className: string, sectionName: string) => void;
  onSelectStudent: (student: StudentRecord) => void;
  mockStudents?: StudentRecord[];
}

export const SectionSelectionPage: React.FC<SectionSelectionPageProps> = ({
  selectedClass: initialClass,
  onBackToClasses,
  onOpenAdmissionWizard,
  onSelectStudent,
}) => {
  const [currentClass, setCurrentClass] = useState<ClassModel>(initialClass);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  // Master Storage States
  const [storedStudents, setStoredStudents] = useState(getStoredStudents());
  const [classCapacities, setClassCapacities] = useState<Record<string, number>>(getStoredClassCapacities());

  // Capacity Modal State
  const [showCapacityModal, setShowCapacityModal] = useState(false);
  const [newCapacityInput, setNewCapacityInput] = useState<number>(80);

  // Add Section Modal state
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [newSecName, setNewSecName] = useState('Section E');
  const [newSecTeacher, setNewSecTeacher] = useState('Mrs. Radhika Nair');
  const [newSecCapacity, setNewSecCapacity] = useState(40);

  useEffect(() => {
    setStoredStudents(getStoredStudents());
    setClassCapacities(getStoredClassCapacities());
  }, []);

  const normalizeClass = (name: string) => {
    if (!name) return '';
    return name.trim().toLowerCase().replace(/^(class|grade)\s*/i, '');
  };

  const normalizeSec = (sec: string) => {
    if (!sec) return 'a';
    return sec.trim().toLowerCase().replace(/^section\s*/i, '');
  };

  // Real class-level calculations from master storage
  const classStudents = storedStudents.filter(
    (s) => normalizeClass(s.className) === normalizeClass(currentClass.className)
  );

  const totalClassEnrolled = classStudents.length;
  const boysEnrolled = classStudents.filter((s) => s.gender === 'Male').length;
  const girlsEnrolled = classStudents.filter((s) => s.gender === 'Female').length;
  const feeDefaultersCount = classStudents.filter((s) => s.feeStatus === 'Defaulter').length;

  const totalClassCapacity = classCapacities[currentClass.className] || currentClass.capacity || 80;
  const classAvailableSeats = Math.max(0, totalClassCapacity - totalClassEnrolled);

  const activeSection = currentClass.sections.find((s) => s.id === activeSectionId) || currentClass.sections[0];

  // Filter students for active section
  const sectionStudents = classStudents.filter((s) => {
    if (!activeSection) return true;
    const secLetter = normalizeSec(activeSection.sectionName);
    return normalizeSec(s.sectionName) === secLetter;
  });

  const handleSaveCapacity = (e: React.FormEvent) => {
    e.preventDefault();
    saveClassCapacityToStorage(currentClass.className, newCapacityInput);
    setClassCapacities(getStoredClassCapacities());
    setShowCapacityModal(false);
  };

  const handleCreateSection = (e: React.FormEvent) => {
    e.preventDefault();
    const newSection: SectionModel = {
      id: `sec-${currentClass.id}-${Date.now()}`,
      sectionName: newSecName,
      className: currentClass.className,
      classTeacher: newSecTeacher,
      totalStudents: 0,
      capacity: newSecCapacity,
      availableSeats: newSecCapacity,
      boysCount: 0,
      girlsCount: 0,
      feeDefaultersCount: 0,
      status: 'ACTIVE',
      occupancyPercent: 0,
    };

    const updatedClass: ClassModel = {
      ...currentClass,
      totalSections: currentClass.totalSections + 1,
      capacity: currentClass.capacity + newSecCapacity,
      availableSeats: currentClass.availableSeats + newSecCapacity,
      sections: [...currentClass.sections, newSection],
    };

    setCurrentClass(updatedClass);
    setShowAddSectionModal(false);
  };

  return (
    <div className={styles.container}>
      {/* Header & Breadcrumb */}
      <header className={styles.header}>
        <div>
          <div className={styles.breadcrumb}>
            <button className={styles.backLink} onClick={onBackToClasses}>
              <ArrowLeft size={14} /> Back to Classes
            </button>
            <span className={styles.breadDivider}>/</span>
            <span className={styles.breadCurrent}>{currentClass.className} Sections</span>
          </div>

          <span className={styles.badgePurple}>
            <Sparkles size={14} /> Section Selection & Management
          </span>
          <h1 className={styles.title}>{currentClass.className} Sections & Roster</h1>
          <p className={styles.subtitle}>
            Select section to enroll new students or manage class section rosters ({currentClass.sections.length} active sections)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className={styles.addSectionBtn}
            onClick={() => setShowAddSectionModal(true)}
          >
            <Plus size={16} />
            <span>Add Section to {currentClass.className}</span>
          </button>

          <button 
            className={styles.primaryAddBtn}
            onClick={() => onOpenAdmissionWizard(currentClass.className, activeSection?.sectionName || 'Section A')}
          >
            <UserPlus size={16} />
            <span>Add Student to {activeSection?.sectionName || currentClass.className}</span>
          </button>
        </div>
      </header>

      {/* SECTION DASHBOARD KPI CARDS */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIconPurple}><Users size={20} /></div>
          <div>
            <span className={styles.kpiLabel}>Total Students</span>
            <h3 className={styles.kpiVal}>{totalClassEnrolled}</h3>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIconBlue}><Users size={20} /></div>
          <div>
            <span className={styles.kpiLabel}>Boys Enrolled</span>
            <h3 className={styles.kpiVal}>{boysEnrolled}</h3>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIconPink}><Users size={20} /></div>
          <div>
            <span className={styles.kpiLabel}>Girls Enrolled</span>
            <h3 className={styles.kpiVal}>{girlsEnrolled}</h3>
          </div>
        </div>

        <div 
          className={styles.kpiCard} 
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setNewCapacityInput(totalClassCapacity);
            setShowCapacityModal(true);
          }}
          title="Click to Configure Available Seats & Capacity"
        >
          <div className={styles.kpiIconGreen}><CheckCircle2 size={20} /></div>
          <div>
            <span className={styles.kpiLabel}>Available Seats <Edit2 size={10} /></span>
            <h3 className={styles.kpiVal}>{classAvailableSeats}</h3>
          </div>
        </div>

        <div 
          className={styles.kpiCard}
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setNewCapacityInput(totalClassCapacity);
            setShowCapacityModal(true);
          }}
          title="Click to Configure Total Capacity"
        >
          <div className={styles.kpiIconSlate}><Layers size={20} /></div>
          <div>
            <span className={styles.kpiLabel}>Total Capacity <Edit2 size={10} /></span>
            <h3 className={styles.kpiVal}>{totalClassCapacity}</h3>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIconRed}><DollarSign size={20} /></div>
          <div>
            <span className={styles.kpiLabel}>Fee Defaulters</span>
            <h3 className={styles.kpiVal}>{feeDefaultersCount}</h3>
          </div>
        </div>
      </div>

      {/* DYNAMIC SECTION CARDS GRID */}
      <div className={styles.sectionCardsGrid}>
        {currentClass.sections.map((sec) => {
          const isSelected = activeSection?.id === sec.id;
          const secLetter = normalizeSec(sec.sectionName);

          const secEnrolledStudents = classStudents.filter(
            (s) => normalizeSec(s.sectionName) === secLetter
          );
          const secEnrolledCount = secEnrolledStudents.length;
          const secBoys = secEnrolledStudents.filter((s) => s.gender === 'Male').length;
          const secGirls = secEnrolledStudents.filter((s) => s.gender === 'Female').length;

          const secCapacity = Math.round(totalClassCapacity / Math.max(1, currentClass.sections.length));

          return (
            <div
              key={sec.id}
              className={`${styles.sectionCard} ${isSelected ? styles.selectedCard : ''}`}
              onClick={() => setActiveSectionId(sec.id)}
            >
              <div className={styles.secTop}>
                <div>
                  <span className={styles.secClassBadge}>{currentClass.className}</span>
                  <h3 className={styles.secTitle}>{sec.sectionName}</h3>
                  <div className={styles.teacherRow}>
                    <span className={styles.teacherLabel}>Class Teacher:</span>
                    <strong className={styles.teacherVal}>{sec.classTeacher}</strong>
                  </div>
                </div>
                <span className={`${styles.secStatusPill} ${secCapacity - secEnrolledCount > 0 ? styles.statusActive : styles.statusFull}`}>
                  {Math.max(0, secCapacity - secEnrolledCount)} SEATS
                </span>
              </div>

              <div className={styles.statsRow}>
                <div>
                  <span className={styles.statSub}>ENROLLED</span>
                  <strong className={styles.statNum}>{secEnrolledCount} / {secCapacity}</strong>
                </div>
                <div>
                  <span className={styles.statSub}>RATIO</span>
                  <strong className={styles.statNum}>{secBoys}B • {secGirls}G</strong>
                </div>
              </div>

              <button 
                className={styles.secAddStudentBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenAdmissionWizard(currentClass.className, sec.sectionName);
                }}
              >
                <UserPlus size={14} />
                <span>+ Add Student to {sec.sectionName} →</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* SECTION STUDENT ROSTER TABLE */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div>
            <h3 className={styles.tableTitle}>
              {currentClass.className} ({activeSection?.sectionName || 'All Sections'}) Student Roster
            </h3>
            <span className={styles.tableSub}>
              Displaying {sectionStudents.length} enrolled students in {activeSection?.sectionName || 'Class'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className={styles.primaryAddBtn}
              onClick={() => onOpenAdmissionWizard(currentClass.className, activeSection?.sectionName || 'Section A')}
            >
              <UserPlus size={15} />
              <span>Enroll Student</span>
            </button>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Adm #</th>
                <th>Roll #</th>
                <th>Student Name</th>
                <th>Gender</th>
                <th>Parent / Guardian</th>
                <th>Mobile</th>
                <th>Fee Status</th>
                <th>Attendance</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sectionStudents.length > 0 ? (
                sectionStudents.map((st) => (
                  <tr key={st.id} onClick={() => onSelectStudent(st)} className={styles.tableRow}>
                    <td><code className={styles.admCode}>{st.admissionNo}</code></td>
                    <td><strong>#{st.rollNo}</strong></td>
                    <td>
                      <div className={styles.nameCell}>
                        <img src={st.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50'} alt="" className={styles.tableAvatar} />
                        <strong>{st.studentName}</strong>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.genderBadge} ${st.gender === 'Female' ? styles.genderPink : styles.genderBlue}`}>
                        {st.gender}
                      </span>
                    </td>
                    <td>{st.parentName}</td>
                    <td>{st.contact}</td>
                    <td>
                      <span className={`${styles.badge} ${
                        st.feeStatus === 'Paid' ? styles.badgeGreen :
                        st.feeStatus === 'Partial' ? styles.badgeAmber : styles.badgeRed
                      }`}>
                        {st.feeStatus}
                      </span>
                    </td>
                    <td><strong>{st.attendancePercent}%</strong></td>
                    <td>
                      <button className={styles.viewBtn} onClick={() => onSelectStudent(st)}>
                        <Eye size={14} /> Profile
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                    No students enrolled in {currentClass.className} ({activeSection?.sectionName || 'Section A'}) yet. Click 'Add Student to {activeSection?.sectionName || 'Section A'}' to enroll.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CAPACITY CONFIGURATION MODAL */}
      {showCapacityModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div style={{ background: '#ffffff', borderRadius: 20, padding: 24, maxWidth: 440, width: '100%', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', position: 'relative' }}>
            <button 
              onClick={() => setShowCapacityModal(false)}
              style={{ position: 'absolute', top: 16, right: 16, background: '#f1f5f9', border: 'none', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
            >
              <X size={16} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ background: '#f3e8ff', color: '#7e22ce', width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Layers size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a', fontWeight: 800 }}>Configure {currentClass.className} Capacity</h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Available seats auto-calculate based on total capacity</p>
              </div>
            </div>

            <form onSubmit={handleSaveCapacity} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: 4 }}>Total Enrolled Students (Read-only)</label>
                <input 
                  type="text" 
                  value={`${totalClassEnrolled} Students Enrolled (${boysEnrolled} Boys, ${girlsEnrolled} Girls)`}
                  disabled
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: 4 }}>Set Total Capacity for {currentClass.className}</label>
                <input 
                  type="number" 
                  min={totalClassEnrolled}
                  max={500}
                  value={newCapacityInput}
                  onChange={(e) => setNewCapacityInput(Number(e.target.value))}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '2px solid #7e22ce', fontSize: '1rem', fontWeight: 800, color: '#0f172a', outline: 'none' }}
                />
              </div>

              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: 12, borderRadius: 12, color: '#166534', fontSize: '0.85rem' }}>
                <strong>Calculated Available Seats:</strong> <span style={{ fontSize: '1rem', fontWeight: 800 }}>{Math.max(0, newCapacityInput - totalClassEnrolled)}</span> seats open
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button 
                  type="button" 
                  onClick={() => setShowCapacityModal(false)}
                  style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{ background: '#7e22ce', color: '#ffffff', border: 'none', padding: '8px 18px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <Check size={16} /> Save New Capacity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD SECTION MODAL */}
      {showAddSectionModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div style={{ background: '#ffffff', borderRadius: 20, padding: 24, maxWidth: 440, width: '100%', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', position: 'relative' }}>
            <button 
              onClick={() => setShowAddSectionModal(false)}
              style={{ position: 'absolute', top: 16, right: 16, background: '#f1f5f9', border: 'none', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
            >
              <X size={16} />
            </button>

            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a', fontWeight: 800, marginBottom: 4 }}>Add New Section to {currentClass.className}</h3>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', marginBottom: 16 }}>Create new section stream for student admissions</p>

            <form onSubmit={handleCreateSection} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: 4 }}>Section Name</label>
                <input 
                  type="text" 
                  value={newSecName}
                  onChange={(e) => setNewSecName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: 4 }}>Assigned Class Teacher</label>
                <input 
                  type="text" 
                  value={newSecTeacher}
                  onChange={(e) => setNewSecTeacher(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: 4 }}>Section Seat Capacity</label>
                <input 
                  type="number" 
                  value={newSecCapacity}
                  onChange={(e) => setNewSecCapacity(Number(e.target.value))}
                  required
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button 
                  type="button" 
                  onClick={() => setShowAddSectionModal(false)}
                  style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{ background: '#7e22ce', color: '#ffffff', border: 'none', padding: '8px 18px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
                >
                  Create Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
