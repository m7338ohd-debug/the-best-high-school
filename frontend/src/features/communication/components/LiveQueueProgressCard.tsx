import React, { useState, useEffect } from 'react';
import { QueueStatus, RecipientContainer, DeliveryChannel } from '../types/communication.types';
import { Zap, CheckCircle2 } from 'lucide-react';
import styles from './LiveQueueProgressCard.module.css';

interface LiveQueueProgressCardProps {
  container: RecipientContainer;
  channel: DeliveryChannel;
  totalRecipients: number;
  onCompleteQueue: () => void;
}

export const LiveQueueProgressCard: React.FC<LiveQueueProgressCardProps> = ({
  container,
  channel,
  totalRecipients,
  onCompleteQueue,
}) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<QueueStatus>('PROCESSING');
  const [deliveredCount, setDeliveredCount] = useState(0);
  const failedCount = 0;

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setStatus('COMPLETED');
          setDeliveredCount(totalRecipients);
          setTimeout(() => onCompleteQueue(), 1500);
          return 100;
        }
        const next = prev + 15;
        const currentDelivered = Math.min(totalRecipients, Math.round((next / 100) * totalRecipients));
        setDeliveredCount(currentDelivered);
        return next;
      });
    }, 400);

    return () => clearInterval(timer);
  }, [totalRecipients, onCompleteQueue]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.zapIcon}>
            {status === 'COMPLETED' ? <CheckCircle2 size={20} /> : <Zap size={20} className={styles.spinZap} />}
          </div>
          <div>
            <h3 className={styles.title}>
              {status === 'COMPLETED' ? 'Bulk Queue Delivery Completed!' : 'Live Message Queue Processing...'}
            </h3>
            <p className={styles.subtitle}>
              Dispatching {channel} to <strong>{container.name}</strong> ({totalRecipients} Total Parent Contacts)
            </p>
          </div>
        </div>

        <span className={`${styles.statusBadge} ${styles[status]}`}>{status}</span>
      </div>

      {/* PROGRESS BAR */}
      <div className={styles.progressContainer}>
        <div className={styles.progHeader}>
          <span>Queue Delivery Momentum</span>
          <strong>{progress}%</strong>
        </div>
        <div className={styles.progTrack}>
          <div className={styles.progFill} style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* METRICS ROW */}
      <div className={styles.metricsRow}>
        <div className={styles.metric}>
          <span className={styles.mLabel}>Queued</span>
          <strong className={styles.mVal}>{totalRecipients}</strong>
        </div>

        <div className={styles.metric}>
          <span className={styles.mLabel}>Delivered</span>
          <strong className={styles.mValGreen}>{deliveredCount}</strong>
        </div>

        <div className={styles.metric}>
          <span className={styles.mLabel}>Failed</span>
          <strong className={styles.mValRed}>{failedCount}</strong>
        </div>

        <div className={styles.metric}>
          <span className={styles.mLabel}>Retrying</span>
          <strong className={styles.mValAmber}>0</strong>
        </div>
      </div>
    </div>
  );
};
