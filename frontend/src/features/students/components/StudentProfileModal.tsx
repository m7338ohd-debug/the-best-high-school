import React, { useState, useRef, useEffect } from 'react';
import { StudentRecord } from '../types/student.types';
import { saveStudentToStorage } from '../../../shared/utils/schoolDataStorage';
import { 
  X, 
  Printer, 
  FileText, 
  Edit, 
  Phone, 
  Mail, 
  MapPin, 
  User, 
  GraduationCap, 
  ShieldCheck, 
  Calendar, 
  Droplet, 
  Bus, 
  Home,
  Camera,
  Upload,
  Check
} from 'lucide-react';
import styles from './StudentProfileModal.module.css';

interface StudentProfileModalProps {
  student: StudentRecord | null;
  onClose: () => void;
  onUpdateStudent?: (student: StudentRecord) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  onClose,
  onUpdateStudent,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  // Edit Form Fields
  const [editName, setEditName] = useState(student?.studentName || '');
  const [editGender, setEditGender] = useState<'Male' | 'Female' | 'Other'>(student?.gender || 'Male');
  const [editParentName, setEditParentName] = useState(student?.parentName || '');
  const [editContact, setEditContact] = useState(student?.contact || '');
  const [editEmail, setEditEmail] = useState(student?.email || '');
  const [editClassName, setEditClassName] = useState(student?.className || 'Class 5');
  const [editSectionName, setEditSectionName] = useState(student?.sectionName || 'A');
  const [editDob, setEditDob] = useState(student?.dob || '');
  const [editAddress, setEditAddress] = useState(student?.address || '');
  const [editAvatarUrl, setEditAvatarUrl] = useState(student?.avatarUrl || '');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (student) {
      setEditName(student.studentName || '');
      setEditGender(student.gender || 'Male');
      setEditParentName(student.parentName || '');
      setEditContact(student.contact || '');
      setEditEmail(student.email || '');
      setEditClassName(student.className || '');
      setEditSectionName(student.sectionName || '');
      setEditDob(student.dob || '');
      setEditAddress(student.address || '');
      setEditAvatarUrl(student.avatarUrl || '');
    }
  }, [student]);

  if (!student) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        setEditAvatarUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: StudentRecord = {
      ...student,
      studentName: editName || student.studentName,
      gender: editGender || student.gender,
      parentName: editParentName || student.parentName,
      contact: editContact || student.contact,
      email: editEmail || student.email,
      className: editClassName || student.className,
      sectionName: editSectionName || student.sectionName,
      dob: editDob || student.dob,
      address: editAddress || student.address,
      avatarUrl: editAvatarUrl || student.avatarUrl,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    saveStudentToStorage(updated);
    if (onUpdateStudent) {
      onUpdateStudent(updated);
    }
    setIsEditing(false);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={18} />
        </button>

        {/* HIDDEN FILE INPUT FOR PHOTO UPLOAD */}
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept="image/*"
          onChange={handlePhotoUpload}
        />

        {isEditing ? (
          /* EDIT STUDENT FORM WORKSPACE */
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ position: 'relative', width: 80, height: 80, cursor: 'pointer' }} onClick={() => fileInputRef.current?.click()}>
                <img 
                  src={editAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
                  alt="Student Photo" 
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid #7e22ce' }} 
                />
                <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#7e22ce', color: '#fff', padding: 6, borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                  <Camera size={14} />
                </div>
              </div>

              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>Update Student Profile & Photo</h3>
                <p style={{ margin: '4px 0 8px 0', fontSize: '0.8rem', color: '#64748b' }}>Click photo above or button below to upload a new passport picture</p>
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ background: '#f3e8ff', color: '#7e22ce', border: '1px solid #d8b4fe', padding: '6px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <Upload size={14} /> Change Photo
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: 4 }}>Student Full Name</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: 4 }}>Gender (Boy / Girl)</label>
                <select
                  value={editGender}
                  onChange={(e) => setEditGender(e.target.value as any)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none', background: '#fff', fontWeight: 700 }}
                >
                  <option value="Male">Male (Boy)</option>
                  <option value="Female">Female (Girl)</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: 4 }}>Parent / Guardian Name</label>
                <input 
                  type="text" 
                  value={editParentName}
                  onChange={(e) => setEditParentName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: 4 }}>Emergency Mobile Contact</label>
                <input 
                  type="text" 
                  value={editContact}
                  onChange={(e) => setEditContact(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: 4 }}>Email Address</label>
                <input 
                  type="email" 
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: 4 }}>Class Name</label>
                <input 
                  type="text" 
                  value={editClassName}
                  onChange={(e) => setEditClassName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: 4 }}>Section Name</label>
                <input 
                  type="text" 
                  value={editSectionName}
                  onChange={(e) => setEditSectionName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: 4 }}>Date of Birth</label>
                <input 
                  type="date" 
                  value={editDob}
                  onChange={(e) => setEditDob(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: 4 }}>Residential Address</label>
                <input 
                  type="text" 
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1rem' }}>
              <button 
                type="button" 
                className={styles.secBtn} 
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className={styles.priBtn}
                style={{ background: '#7e22ce', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <Check size={16} /> Save Changes
              </button>
            </div>
          </form>
        ) : (
          /* READ-ONLY PROFILE DISPLAY */
          <>
            {/* Modal Header */}
            <div className={styles.modalHeader}>
              <div className={styles.avatarWrapper} style={{ cursor: 'pointer' }} title="Click Edit Record to change photo" onClick={() => setIsEditing(true)}>
                <img 
                  src={student.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
                  alt={student.studentName} 
                  className={styles.avatarImg} 
                />
                <span className={styles.activeDot} />
              </div>

              <div>
                <span className={styles.admBadge}>{student.admissionNo} • Roll #{student.rollNo}</span>
                <h2 className={styles.studentName}>{student.studentName}</h2>
                <div className={styles.subMeta}>
                  <span>{student.className} - Section {student.sectionName}</span>
                  <span className={styles.metaDot}>•</span>
                  <span className={styles.houseTag}>{student.house || 'General'}</span>
                </div>
              </div>
            </div>

            {/* Quick Status Bar */}
            <div className={styles.statusBar}>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Fee Status</span>
                <span className={`${styles.badge} ${
                  student.feeStatus === 'Paid' ? styles.badgeGreen :
                  student.feeStatus === 'Partial' ? styles.badgeAmber : styles.badgeRed
                }`}>
                  {student.feeStatus}
                </span>
              </div>

              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Attendance Rate</span>
                <span className={styles.badgeEmerald}>{student.attendancePercent}% Present</span>
              </div>

              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Enrollment</span>
                <span className={styles.badgePurple}>{student.status}</span>
              </div>
            </div>

            {/* Details Grid */}
            <div className={styles.detailsGrid}>
              {/* Section 1: Personal & Parent Info */}
              <div className={styles.infoBox}>
                <h4 className={styles.boxTitle}><User size={15} /> Personal & Parent Information</h4>
                <div className={styles.infoRow}>
                  <span className={styles.fieldLabel}>Parent / Guardian:</span>
                  <strong>{student.parentName} ({student.parentRelation || 'Parent'})</strong>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.fieldLabel}>Emergency Mobile:</span>
                  <span><Phone size={13} /> {student.contact}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.fieldLabel}>Email Address:</span>
                  <span><Mail size={13} /> {student.email}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.fieldLabel}>Date of Birth:</span>
                  <span><Calendar size={13} /> {student.dob || 'N/A'}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.fieldLabel}>Residential Address:</span>
                  <span><MapPin size={13} /> {student.address || 'N/A'}</span>
                </div>
              </div>

              {/* Section 2: School Logistics & Health */}
              <div className={styles.infoBox}>
                <h4 className={styles.boxTitle}><GraduationCap size={15} /> School Logistics & Health</h4>
                <div className={styles.infoRow}>
                  <span className={styles.fieldLabel}>Admission Date:</span>
                  <strong>{student.admissionDate}</strong>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.fieldLabel}>Blood Group:</span>
                  <span><Droplet size={13} style={{ color: '#ef4444' }} /> <strong>{student.bloodGroup || 'O+'}</strong></span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.fieldLabel}>Transport Route:</span>
                  <span><Bus size={13} /> {student.transport || 'School Bus'}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.fieldLabel}>Hostel Status:</span>
                  <span><Home size={13} /> {student.hostel || 'Day Scholar'}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.fieldLabel}>Record Last Updated:</span>
                  <span>{student.lastUpdated || 'Today'}</span>
                </div>
              </div>
            </div>

            {/* Student ID Card Preview Block */}
            <div className={styles.idCardPreview}>
              <div className={styles.idCardHeader}>
                <ShieldCheck size={16} /> Print-Ready School Student ID Card
              </div>
              <div className={styles.idCardBody}>
                <div className={styles.idCardLeft}>
                  <img src={student.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'} alt="ID" className={styles.idPhoto} />
                </div>
                <div className={styles.idCardRight}>
                  <strong className={styles.idSchoolName}>SCHOOL STUDENT ID CARD</strong>
                  <div className={styles.idStudentName}>{student.studentName}</div>
                  <div className={styles.idMeta}>ID: {student.admissionNo} • Class: {student.className}-{student.sectionName}</div>
                  <div className={styles.idContact}>Emergency: {student.contact}</div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className={styles.modalFooter}>
              <button className={styles.secBtn} onClick={() => window.print()}>
                <Printer size={15} /> Print ID Card
              </button>
              <button className={styles.secBtn}>
                <FileText size={15} /> Generate Certificate
              </button>
              <button className={styles.priBtn} onClick={() => setIsEditing(true)}>
                <Edit size={15} /> Edit Record & Photo
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
