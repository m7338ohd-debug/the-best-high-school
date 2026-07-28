import React from 'react';
import { Card } from '../ui/Card/Card';
import { Activity, DollarSign, UserPlus, Settings, FileText } from 'lucide-react';
import styles from './ActivityTimeline.module.css';

export interface ActivityItem {
  id: string;
  type: 'FEE_COLLECTION' | 'STUDENT_REGISTRATION' | 'SETTINGS_UPDATE' | 'RECEIPT_GENERATION' | 'USER_LOGIN';
  title: string;
  description: string;
  actor: string;
  timestamp: string;
}

export interface ActivityTimelineProps {
  items: ActivityItem[];
  title?: string;
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ items, title = 'Recent Activity' }) => {
  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'FEE_COLLECTION':
        return <DollarSign size={14} className={styles.iconFee} />;
      case 'STUDENT_REGISTRATION':
        return <UserPlus size={14} className={styles.iconStudent} />;
      case 'SETTINGS_UPDATE':
        return <Settings size={14} className={styles.iconSettings} />;
      case 'RECEIPT_GENERATION':
        return <FileText size={14} className={styles.iconReceipt} />;
      default:
        return <Activity size={14} className={styles.iconDefault} />;
    }
  };

  return (
    <Card title={title} className={styles.card}>
      <div className={styles.timeline}>
        {items.map((item, idx) => (
          <div key={item.id} className={styles.item}>
            <div className={styles.iconBadge}>{getIcon(item.type)}</div>
            {idx < items.length - 1 && <div className={styles.connector} />}
            <div className={styles.content}>
              <div className={styles.header}>
                <span className={styles.itemTitle}>{item.title}</span>
                <span className={styles.timestamp}>{item.timestamp}</span>
              </div>
              <p className={styles.description}>{item.description}</p>
              <span className={styles.actor}>by {item.actor}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
