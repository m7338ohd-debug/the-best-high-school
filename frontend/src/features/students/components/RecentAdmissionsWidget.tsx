import React from 'react';
import { StudentRecord } from '../types/student.types';
import { Sparkles, Calendar, ArrowRight } from 'lucide-react';
import styles from './RecentAdmissionsWidget.module.css';

interface RecentAdmissionsWidgetProps {
  students: StudentRecord[];
  onSelectStudent: (student: StudentRecord) => void;
}

export const RecentAdmissionsWidget: React.FC<RecentAdmissionsWidgetProps> = ({
  students,
  onSelectStudent,
}) => {
  // Take last 10 admitted students
  const recent10 = students.slice(0, 10);

  return (
    <div className={styles.widgetCard}>
      <div className={styles.header}>
        <div>
          <span className={styles.badgePurple}>
            <Sparkles size={12} /> Real-Time Admissions Feed
          </span>
          <h3 className={styles.title}>Recent Admissions (Last 10 Enrolled)</h3>
          <p className={styles.subtitle}>Click any row to open the complete student profile & academic file</p>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Photo</th>
              <th>Admission No</th>
              <th>Student Name</th>
              <th>Class</th>
              <th>Section</th>
              <th>Admission Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {recent10.map((s) => (
              <tr key={s.id} onClick={() => onSelectStudent(s)} className={styles.row}>
                <td>
                  <img 
                    src={s.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'} 
                    alt={s.studentName} 
                    className={styles.avatar} 
                  />
                </td>
                <td><code className={styles.admCode}>{s.admissionNo}</code></td>
                <td>
                  <strong className={styles.nameText}>{s.studentName}</strong>
                </td>
                <td>{s.className}</td>
                <td><span className={styles.secBadge}>{s.sectionName}</span></td>
                <td>
                  <div className={styles.dateCell}>
                    <Calendar size={13} className={styles.calIcon} />
                    <span>{s.admissionDate}</span>
                  </div>
                </td>
                <td>
                  <span className={`${styles.statusBadge} ${s.status === 'ACTIVE' ? styles.statusActive : styles.statusInactive}`}>
                    {s.status}
                  </span>
                </td>
                <td>
                  <button className={styles.viewBtn}>
                    <span>Profile</span>
                    <ArrowRight size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
