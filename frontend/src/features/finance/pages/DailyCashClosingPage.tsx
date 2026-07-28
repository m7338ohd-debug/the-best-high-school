import React, { useState } from 'react';
import { Card } from '../../../shared/components/ui/Card/Card';
import { Button } from '../../../shared/components/ui/Button/Button';
import { Input } from '../../../shared/components/ui/Input/Input';
import { ShieldCheck, CheckCircle2, Lock, Landmark } from 'lucide-react';
import styles from './DailyCashClosingPage.module.css';

export const DailyCashClosingPage: React.FC = () => {
  const [closingDate] = useState('2026-07-27');
  const [actualCashCount, setActualCashCount] = useState('4850');
  const [closedBy] = useState('Accountant John');
  const [isLocked, setIsLocked] = useState(false);

  // Bank Deposit state
  const [bankName, setBankName] = useState('Chase Bank USA');
  const [depositAmount, setDepositAmount] = useState('4850');
  const [depositSuccess, setDepositSuccess] = useState(false);

  const handleCloseCash = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLocked(true);
  };

  const handleBankDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    setDepositSuccess(true);
    setTimeout(() => setDepositSuccess(false), 3000);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>Daily Cash Closing & Bank Reconciliation Register</h2>
          <p className={styles.subtitle}>Reconcile daily cash counter collections, lock daily transactions, and register bank deposits</p>
        </div>
      </header>

      <div className={styles.grid}>
        {/* Daily Cash Closing Register */}
        <Card title="Daily Cash Counter Closing Register">
          <form onSubmit={handleCloseCash} className={styles.form}>
            <div className={styles.statBox}>
              <div className={styles.statRow}>
                <span>Target Date:</span> <strong>{closingDate}</strong>
              </div>
              <div className={styles.statRow}>
                <span>Expected Cash Collected:</span> <strong>$4,850.00</strong>
              </div>
            </div>

            <Input
              label="Physical Actual Cash Count ($)"
              value={actualCashCount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setActualCashCount(e.target.value)}
              disabled={isLocked}
              required
            />

            <Input
              label="Accountant / Closed By"
              value={closedBy}
              disabled
            />

            {isLocked ? (
              <div className={styles.lockedNotice}>
                <Lock size={18} /> Daily Cash Counter Closed & Locked for {closingDate}
              </div>
            ) : (
              <Button type="submit" variant="primary" leftIcon={<Lock size={16} />}>
                Lock & Close Daily Cash Counter
              </Button>
            )}
          </form>
        </Card>

        {/* Bank Deposit Register */}
        <Card title="Bank Deposit Entry Register">
          <form onSubmit={handleBankDeposit} className={styles.form}>
            <Input
              label="Bank Name"
              value={bankName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBankName(e.target.value)}
              required
            />
            <Input
              label="Deposit Amount ($)"
              value={depositAmount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDepositAmount(e.target.value)}
              required
            />
            <Button type="submit" variant="primary" leftIcon={<Landmark size={16} />}>
              Record Physical Bank Deposit
            </Button>

            {depositSuccess && (
              <div className={styles.successToast}>
                <CheckCircle2 size={16} /> Bank Deposit DEP-2026-000042 Recorded & Reconciled!
              </div>
            )}
          </form>
        </Card>
      </div>

      {/* System Integrity Banner */}
      <Card className={styles.integrityCard}>
        <div className={styles.integrityHeader}>
          <ShieldCheck size={24} className={styles.shieldIcon} />
          <div>
            <h4 className={styles.integrityTitle}>Automated Financial Data Integrity Check</h4>
            <span className={styles.integritySub}>Ledger balances, receipt sequence continuity (REC-2026-XXXXXX), and double-entry carry forwards verified 100% HEALTHY</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
