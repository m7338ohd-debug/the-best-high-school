import React from 'react';
import { StudentRecord } from '../types/student.types';
import { 
  UserPlus, 
  Calendar, 
  Cake, 
  Clock, 
  FileText, 
  AlertCircle 
} from 'lucide-react';
import styles from './QuickSummaryCards.module.css';

interface QuickSummaryCardsProps {
  students?: StudentRecord[];
}

export const QuickSummaryCards: React.FC<QuickSummaryCardsProps> = ({ students = [] }) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAdmissions = students.filter((s) => s.admissionDate === todayStr).length;

  const summaryItems = [
    { label: "Today's Admissions", val: `${todayAdmissions}`, sub: 'Enrolled today', icon: <UserPlus size={18} />, color: '#7e22ce' },
    { label: 'New This Week', val: `${students.length}`, sub: 'Enrolled roster', icon: <Calendar size={18} />, color: '#2563eb' },
    { label: 'Birthdays Today', val: '0', sub: 'No student birthdays today 🎂', icon: <Cake size={18} />, color: '#db2777' },
    { label: 'Students on Leave', val: '0', sub: 'Approved leave applications', icon: <Clock size={18} />, color: '#d97706' },
    { label: 'Transfer Requests', val: '0', sub: 'Pending TC approval', icon: <FileText size={18} />, color: '#0284c7' },
    { label: 'Pending Admissions', val: '0', sub: 'Documents under review', icon: <AlertCircle size={18} />, color: '#dc2626' },
  ];

  return (
    <div className={styles.container}>
      {summaryItems.map((item, idx) => (
        <div key={idx} className={styles.summaryCard}>
          <div className={styles.iconCircle} style={{ backgroundColor: `${item.color}15`, color: item.color }}>
            {item.icon}
          </div>
          <div>
            <span className={styles.valText}>{item.val}</span>
            <strong className={styles.labelText}>{item.label}</strong>
            <span className={styles.subText}>{item.sub}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
