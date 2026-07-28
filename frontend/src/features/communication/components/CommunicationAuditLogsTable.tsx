import React, { useState } from 'react';
import { CommunicationAuditLog } from '../types/communication.types';
import { 
  History, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  MessageSquare, 
  Mail, 
  MessageCircle,
  Sparkles
} from 'lucide-react';
import styles from './CommunicationAuditLogsTable.module.css';

interface CommunicationAuditLogsTableProps {
  logs: CommunicationAuditLog[];
  onRetryFailed: (logId: string) => void;
}

export const CommunicationAuditLogsTable: React.FC<CommunicationAuditLogsTableProps> = ({
  logs,
  onRetryFailed,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState('ALL');

  const filtered = logs.filter((log) => {
    if (channelFilter !== 'ALL' && log.channel !== channelFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.messageSnippet.toLowerCase().includes(q) ||
        log.recipientGroupName.toLowerCase().includes(q) ||
        (log.subject && log.subject.toLowerCase().includes(q)) ||
        log.sender.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getChannelBadge = (ch: string) => {
    switch (ch) {
      case 'SMS': return <span className={styles.smsBadge}><MessageSquare size={12} /> SMS</span>;
      case 'EMAIL': return <span className={styles.emailBadge}><Mail size={12} /> EMAIL</span>;
      case 'WHATSAPP': return <span className={styles.waBadge}><MessageCircle size={12} /> WHATSAPP</span>;
      default: return <span className={styles.allBadge}><Sparkles size={12} /> ALL CHANNELS</span>;
    }
  };

  return (
    <div className={styles.tableCard}>
      <div className={styles.header}>
        <div>
          <span className={styles.badgePurple}><History size={14} /> Audit Trail & History</span>
          <h3 className={styles.title}>Parent Communication History & Audit Logs</h3>
          <p className={styles.subtitle}>Complete historical record of bulk broadcast messages, queue delivery status & retries</p>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search size={14} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search Student, Parent, Mobile, Class, Message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className={styles.selectFilter}
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
          >
            <option value="ALL">All Delivery Channels</option>
            <option value="SMS">SMS Only</option>
            <option value="EMAIL">Email Only</option>
            <option value="WHATSAPP">WhatsApp Only</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Channel</th>
              <th>Recipient Container</th>
              <th>Message Snippet / Subject</th>
              <th>Sender</th>
              <th>Delivered / Failed</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log) => (
              <tr key={log.id} className={styles.row}>
                <td>
                  <span className={styles.timeText}><Clock size={12} /> {log.timestamp}</span>
                </td>
                <td>{getChannelBadge(log.channel)}</td>
                <td><strong>{log.recipientGroupName}</strong></td>
                <td>
                  <div>
                    {log.subject && <strong className={styles.subjectText}>{log.subject}</strong>}
                    <p className={styles.snippetText}>{log.messageSnippet}</p>
                  </div>
                </td>
                <td>
                  <span className={styles.senderText}><UserCheck size={12} /> {log.sender}</span>
                </td>
                <td>
                  <div className={styles.deliveryBadgeGroup}>
                    <span className={styles.successBadge}>✓ {log.successful}</span>
                    {log.failed > 0 && <span className={styles.failBadge}>✕ {log.failed}</span>}
                  </div>
                </td>
                <td>
                  <span className={`${styles.statusBadge} ${styles[log.status]}`}>{log.status}</span>
                </td>
                <td>
                  {log.failed > 0 ? (
                    <button
                      className={styles.retryBtn}
                      onClick={() => onRetryFailed(log.id)}
                    >
                      <RefreshCw size={12} /> Retry ({log.failed})
                    </button>
                  ) : (
                    <span className={styles.okText}><CheckCircle2 size={14} /> Completed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
