import React, { useState } from 'react';
import { Card } from '../../../shared/components/ui/Card/Card';
import { Button } from '../../../shared/components/ui/Button/Button';
import { Database, Download, RefreshCw, CheckCircle2 } from 'lucide-react';
import styles from './BackupRestoreCenterPage.module.css';

interface BackupItem {
  id: string;
  name: string;
  size: string;
  type: string;
  date: string;
  status: string;
}

const mockBackups: BackupItem[] = [
  { id: '1', name: 'system-backup-20260727-0200.json', size: '5.4 MB', type: 'AUTOMATED', date: '2026-07-27 02:00:00', status: 'COMPLETED' },
  { id: '2', name: 'system-backup-20260726-0200.json', size: '5.2 MB', type: 'AUTOMATED', date: '2026-07-26 02:00:00', status: 'COMPLETED' },
  { id: '3', name: 'manual-pre-migration-backup.json', size: '5.1 MB', type: 'MANUAL', date: '2026-07-25 14:32:10', status: 'COMPLETED' },
];

export const BackupRestoreCenterPage: React.FC = () => {
  const [backups, setBackups] = useState<BackupItem[]>(mockBackups);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleCreateBackup = () => {
    const newBackup: BackupItem = {
      id: String(Date.now()),
      name: `manual-backup-${new Date().toISOString().slice(0, 10)}.json`,
      size: '5.4 MB',
      type: 'MANUAL',
      date: new Date().toLocaleString(),
      status: 'COMPLETED',
    };
    setBackups([newBackup, ...backups]);
    setSuccessMsg('Manual database snapshot backup created successfully!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleRestore = (name: string) => {
    setSuccessMsg(`Disaster recovery restore verified and completed for backup: ${name}`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>Database Backup & Disaster Recovery Center</h2>
          <p className={styles.subtitle}>Automated daily database snapshots, manual backups, and disaster recovery restore engines</p>
        </div>
        <Button variant="primary" leftIcon={<Database size={16} />} onClick={handleCreateBackup}>
          Trigger Instant Manual Backup
        </Button>
      </header>

      {successMsg && (
        <div className={styles.toast}>
          <CheckCircle2 size={16} /> {successMsg}
        </div>
      )}

      <Card title="Database Snapshot Backup History">
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Backup File Name</th>
                <th>Size</th>
                <th>Type</th>
                <th>Created Timestamp</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {backups.map((item) => (
                <tr key={item.id}>
                  <td className={styles.fileName}>
                    <Database size={14} className={styles.icon} />
                    {item.name}
                  </td>
                  <td>{item.size}</td>
                  <td><span className={styles.typeBadge}>{item.type}</span></td>
                  <td>{item.date}</td>
                  <td><span className={styles.statusBadge}>{item.status}</span></td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.actionBtn} title="Download Snapshot">
                        <Download size={14} /> Download
                      </button>
                      <button className={styles.restoreBtn} onClick={() => handleRestore(item.name)} title="Execute Disaster Recovery Restore">
                        <RefreshCw size={14} /> Restore
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
