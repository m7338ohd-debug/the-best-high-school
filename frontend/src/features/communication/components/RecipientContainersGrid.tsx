import React from 'react';
import { RecipientContainer } from '../types/communication.types';
import { 
  Users, 
  Smartphone, 
  Mail, 
  MessageCircle, 
  Sparkles, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';
import styles from './RecipientContainersGrid.module.css';

interface RecipientContainersGridProps {
  containers: RecipientContainer[];
  selectedContainerId: string;
  onSelectContainer: (container: RecipientContainer) => void;
}

export const RecipientContainersGrid: React.FC<RecipientContainersGridProps> = ({
  containers,
  selectedContainerId,
  onSelectContainer,
}) => {
  // Container 1 & Container 2
  const mainContainers = containers.filter((c) => c.category === 'GRADE_RANGE');
  const smartGroups = containers.filter((c) => c.category !== 'GRADE_RANGE');

  return (
    <div className={styles.container}>
      {/* SECTION HEADER */}
      <div className={styles.sectionHeader}>
        <div>
          <span className={styles.badgePurple}>
            <Sparkles size={14} /> Automated Directory Recipient Synchronization
          </span>
          <h2 className={styles.sectionTitle}>Smart Bulk Recipient Containers</h2>
          <p className={styles.sectionSub}>
            Contact details automatically synchronized from Student Directory (Single Source of Truth)
          </p>
        </div>
      </div>

      {/* CONTAINER 1 & CONTAINER 2 MAIN CARDS */}
      <div className={styles.mainGrid}>
        {mainContainers.map((c) => {
          const isSelected = selectedContainerId === c.id;
          return (
            <div
              key={c.id}
              className={`${styles.mainCard} ${isSelected ? styles.selectedCard : ''}`}
              onClick={() => onSelectContainer(c)}
            >
              <div className={styles.cardHeader}>
                <div className={styles.cardIconBox}>
                  <Layers size={22} />
                </div>
                <div>
                  <h3 className={styles.cardTitle}>{c.name}</h3>
                  <span className={styles.cardDesc}>{c.description}</span>
                </div>
                {isSelected && (
                  <span className={styles.activeCheckPill}>
                    <CheckCircle2 size={14} /> ACTIVE TARGET
                  </span>
                )}
              </div>

              {/* STATS MATRIX */}
              <div className={styles.statsGrid}>
                <div className={styles.statBox}>
                  <Users size={14} className={styles.iconPurple} />
                  <div>
                    <span className={styles.statLabel}>Students</span>
                    <strong className={styles.statVal}>{c.totalStudents}</strong>
                  </div>
                </div>

                <div className={styles.statBox}>
                  <Smartphone size={14} className={styles.iconBlue} />
                  <div>
                    <span className={styles.statLabel}>Mobile Numbers</span>
                    <strong className={styles.statVal}>{c.totalMobiles}</strong>
                  </div>
                </div>

                <div className={styles.statBox}>
                  <Mail size={14} className={styles.iconAmber} />
                  <div>
                    <span className={styles.statLabel}>Email Addresses</span>
                    <strong className={styles.statVal}>{c.totalEmails}</strong>
                  </div>
                </div>

                <div className={styles.statBox}>
                  <MessageCircle size={14} className={styles.iconGreen} />
                  <div>
                    <span className={styles.statLabel}>WhatsApp Ready</span>
                    <strong className={styles.statVal}>{c.whatsappEnabled}</strong>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SMART RECIPIENT GROUPS PILLS */}
      <div className={styles.smartGroupsSection}>
        <h4 className={styles.smartTitle}>Additional Smart Recipient Groups</h4>
        <div className={styles.pillsGrid}>
          {smartGroups.map((g) => {
            const isSelected = selectedContainerId === g.id;
            return (
              <button
                key={g.id}
                type="button"
                className={`${styles.pillBtn} ${isSelected ? styles.pillSelected : ''}`}
                onClick={() => onSelectContainer(g)}
              >
                <div className={styles.pillLeft}>
                  <strong>{g.name}</strong>
                  <span className={styles.pillCount}>
                    {g.totalStudents} Students ({g.whatsappEnabled} WA)
                  </span>
                </div>
                {isSelected && <CheckCircle2 size={14} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
