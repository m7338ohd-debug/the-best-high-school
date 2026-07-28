import React from 'react';
import { RecipientContainer, DeliveryChannel } from '../types/communication.types';
import { Send, X, AlertTriangle, Clock, MessageSquare, Mail, MessageCircle } from 'lucide-react';
import styles from './SendConfirmationModal.module.css';

interface SendConfirmationModalProps {
  container: RecipientContainer;
  channel: DeliveryChannel;
  subject: string;
  message: string;
  onClose: () => void;
  onConfirmSend: () => void;
}

export const SendConfirmationModal: React.FC<SendConfirmationModalProps> = ({
  container,
  channel,
  onClose,
  onConfirmSend,
}) => {
  const isSms = channel.includes('SMS') || channel === 'ALL';
  const isEmail = channel.includes('EMAIL') || channel === 'ALL';
  const isWa = channel.includes('WHATSAPP') || channel === 'ALL';

  const smsCount = isSms ? container.totalMobiles : 0;
  const emailCount = isEmail ? container.totalEmails : 0;
  const waCount = isWa ? container.whatsappEnabled : 0;

  const totalMsgCount = smsCount + emailCount + waCount;
  const estimatedSeconds = Math.max(2, Math.ceil(totalMsgCount / 150));

  return (
    <div className={styles.overlay}>
      <div className={styles.modalCard}>
        <div className={styles.header}>
          <div className={styles.alertIconBadge}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className={styles.title}>Confirm Bulk Parent Broadcast</h3>
            <span className={styles.subtitle}>Review recipient metrics before queue dispatch</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
        </div>

        <div className={styles.body}>
          <div className={styles.groupInfoBox}>
            <span className={styles.targetLabel}>Target Recipient Container:</span>
            <strong className={styles.targetVal}>{container.name}</strong>
            <p className={styles.targetSub}>{container.description} ({container.totalStudents} Enrolled Students)</p>
          </div>

          <div className={styles.countsGrid}>
            <div className={styles.countCard}>
              <MessageSquare size={18} className={styles.smsColor} />
              <div>
                <span className={styles.countLabel}>SMS Count</span>
                <strong className={styles.countVal}>{smsCount}</strong>
              </div>
            </div>

            <div className={styles.countCard}>
              <Mail size={18} className={styles.emailColor} />
              <div>
                <span className={styles.countLabel}>Email Count</span>
                <strong className={styles.countVal}>{emailCount}</strong>
              </div>
            </div>

            <div className={styles.countCard}>
              <MessageCircle size={18} className={styles.waColor} />
              <div>
                <span className={styles.countLabel}>WhatsApp Count</span>
                <strong className={styles.countVal}>{waCount}</strong>
              </div>
            </div>
          </div>

          <div className={styles.timeInfoBox}>
            <Clock size={16} />
            <span>Estimated Queue Processing Time: <strong>~{estimatedSeconds} seconds</strong> (via Queue Worker)</span>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.confirmBtn} onClick={onConfirmSend}>
            <Send size={16} /> Send Now ({totalMsgCount} Messages)
          </button>
        </div>
      </div>
    </div>
  );
};
