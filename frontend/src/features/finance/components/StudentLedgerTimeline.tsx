import React, { useState } from 'react';
import { LedgerEntry } from '../types/finance.types';
import { 
  History, 
  Search, 
  Receipt, 
  DollarSign, 
  Tag, 
  AlertCircle, 
  RefreshCw, 
  Clock, 
  UserCheck 
} from 'lucide-react';
import styles from './StudentLedgerTimeline.module.css';

interface StudentLedgerTimelineProps {
  entries: LedgerEntry[];
  studentName: string;
}

export const StudentLedgerTimeline: React.FC<StudentLedgerTimelineProps> = ({
  entries,
  studentName,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntries = entries.filter((e) => {
    if (filterType !== 'ALL' && e.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        e.description.toLowerCase().includes(q) ||
        (e.receiptNo && e.receiptNo.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'PAYMENT': return <DollarSign size={16} />;
      case 'DISCOUNT': return <Tag size={16} />;
      case 'LATE_FINE': return <AlertCircle size={16} />;
      case 'REFUND': return <RefreshCw size={16} />;
      default: return <Receipt size={16} />;
    }
  };

  return (
    <div className={styles.ledgerCard}>
      <div className={styles.header}>
        <div>
          <div className={styles.badgePurple}><History size={14} /> Audit Trail Timeline</div>
          <h3 className={styles.title}>{studentName} Complete Financial Ledger</h3>
          <p className={styles.subtitle}>Historical timeline of fees generated, counter receipts, discounts, fines & refunds</p>
        </div>

        {/* Filters & Search */}
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search size={14} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search ledger entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className={styles.selectFilter}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="ALL">All Event Types</option>
            <option value="PAYMENT">Payments Only</option>
            <option value="FEE_GENERATED">Fees Generated</option>
            <option value="DISCOUNT">Discounts / Waivers</option>
            <option value="LATE_FINE">Late Fines</option>
            <option value="REFUND">Refunds</option>
          </select>
        </div>
      </div>

      {/* Timeline List */}
      <div className={styles.timelineList}>
        {filteredEntries.map((e) => (
          <div key={e.id} className={styles.timelineItem}>
            <div className={styles.lineConnector} />
            <div className={`${styles.iconNode} ${styles[e.type]}`}>
              {getIcon(e.type)}
            </div>

            <div className={styles.contentBox}>
              <div className={styles.topMeta}>
                <span className={styles.dateText}><Clock size={12} /> {e.date}</span>
                <span className={`${styles.typeBadge} ${styles[`badge_${e.type}`]}`}>{e.type.replace('_', ' ')}</span>
              </div>

              <h4 className={styles.description}>{e.description}</h4>

              <div className={styles.bottomRow}>
                <div className={styles.amountGroup}>
                  <span>Transaction:</span>
                  <strong className={e.type === 'PAYMENT' || e.type === 'DISCOUNT' ? styles.amtGreen : styles.amtRed}>
                    {e.type === 'PAYMENT' || e.type === 'DISCOUNT' ? '-' : '+'}₹{e.amount.toLocaleString('en-IN')}
                  </strong>
                </div>

                <div className={styles.balGroup}>
                  <span>Balance After:</span>
                  <strong>₹{e.balanceAfter.toLocaleString('en-IN')}</strong>
                </div>

                {e.receiptNo && (
                  <div className={styles.receiptGroup}>
                    <span>Receipt:</span>
                    <code className={styles.receiptCode}>{e.receiptNo}</code>
                  </div>
                )}

                {e.collectorName && (
                  <div className={styles.collectorGroup}>
                    <span><UserCheck size={12} /> {e.collectorName}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
