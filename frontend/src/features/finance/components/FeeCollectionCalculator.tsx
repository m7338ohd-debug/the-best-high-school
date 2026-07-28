import React, { useState } from 'react';
import { FeeItem, PaymentChannel } from '../types/finance.types';
import { 
  IndianRupee, 
  Sparkles, 
  CreditCard, 
  QrCode, 
  Building2, 
  FileText 
} from 'lucide-react';
import styles from './FeeCollectionCalculator.module.css';

interface FeeCollectionCalculatorProps {
  feeItems: FeeItem[];
  onProcessPayment: (data: {
    selectedFeeItems: FeeItem[];
    discountAmount: number;
    scholarshipAmount: number;
    fineAmount: number;
    receivingAmount: number;
    paymentChannel: PaymentChannel;
    referenceNo: string;
    chequeDetails?: { chequeNo: string; bankName: string; chequeDate: string };
  }) => void;
}

export const FeeCollectionCalculator: React.FC<FeeCollectionCalculatorProps> = ({
  feeItems,
  onProcessPayment,
}) => {
  const [selectedFeeIds, setSelectedFeeIds] = useState<string[]>(feeItems.map((f) => f.id));
  const [fineAmount, setFineAmount] = useState<number>(0);
  const [paymentChannel, setPaymentChannel] = useState<PaymentChannel>('UPI');
  const [referenceNo, setReferenceNo] = useState<string>('UPI-987293847');
  const [chequeNo, setChequeNo] = useState<string>('CHQ-554433');
  const [bankName, setBankName] = useState<string>('HDFC Bank');
  const [chequeDate, setChequeDate] = useState<string>('2026-07-28');

  // Selected fee items
  const selectedItems = feeItems.filter((f) => selectedFeeIds.includes(f.id));

  // Math Calculations: Original Dues + Late Fine Surcharge (+)
  const originalTotal = selectedItems.reduce((acc, f) => acc + f.balanceDue, 0);
  const netPayable = Math.max(0, originalTotal + fineAmount);

  // Receiving amount state
  const [receivingAmount, setReceivingAmount] = useState<number>(netPayable);

  const remainingBalance = Math.max(0, netPayable - receivingAmount);

  const toggleFeeSelection = (id: string) => {
    setSelectedFeeIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onProcessPayment({
      selectedFeeItems: selectedItems,
      discountAmount: 0,
      scholarshipAmount: 0,
      fineAmount,
      receivingAmount,
      paymentChannel,
      referenceNo,
      chequeDetails: paymentChannel === 'CHEQUE' ? { chequeNo, bankName, chequeDate } : undefined,
    });
  };

  return (
    <div className={styles.calculatorCard}>
      <div className={styles.cardHeader}>
        <div>
          <span className={styles.badgePurple}><Sparkles size={14} /> Fee Collection & Calculator</span>
          <h3 className={styles.title}>Pending Fee Collection & Live Ledger Calculator</h3>
          <p className={styles.subtitle}>Select pending dues, add late fines if applicable, and process payment</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* PENDING FEE CARDS SELECTION */}
        <div className={styles.sectionTitle}>1. Select Pending Fee Line Items</div>
        <div className={styles.feeCardsGrid}>
          {feeItems.map((item) => {
            const isChecked = selectedFeeIds.includes(item.id);
            return (
              <div
                key={item.id}
                className={`${styles.feeCard} ${isChecked ? styles.feeCardSelected : ''}`}
                onClick={() => toggleFeeSelection(item.id)}
              >
                <div className={styles.feeCardTop}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleFeeSelection(item.id)}
                    className={styles.checkbox}
                  />
                  <span className={styles.feeCategory}>{item.category}</span>
                  <span className={`${styles.statusBadge} ${styles[item.status]}`}>{item.status}</span>
                </div>

                <div className={styles.feeCardBody}>
                  <span className={styles.termLabel}>{item.monthTerm} • Due: {item.dueDate}</span>
                  <strong className={styles.dueVal}>₹{item.balanceDue.toLocaleString('en-IN')}</strong>
                </div>
              </div>
            );
          })}
        </div>

        {/* LIVE COLLECTION CALCULATOR */}
        <div className={styles.sectionTitle} style={{ marginTop: 24 }}>2. Live Collection & Adjustment Calculator</div>
        <div className={styles.calcGrid}>
          <div className={styles.inputBox}>
            <label className={styles.label}>Original Selected Dues (₹)</label>
            <input type="number" className={styles.readOnlyInput} value={originalTotal} readOnly />
          </div>

          <div className={styles.inputBox}>
            <label className={styles.label}>Add Late Fine / Surcharge (+₹)</label>
            <input
              type="number"
              className={styles.input}
              value={fineAmount}
              onChange={(e) => setFineAmount(Number(e.target.value))}
            />
          </div>
        </div>

        {/* RECEIVING AMOUNT & REMAINING BALANCE */}
        <div className={styles.totalSummaryBar}>
          <div className={styles.summaryItem}>
            <span>Net Payable:</span>
            <strong className={styles.netVal}>₹{netPayable.toLocaleString('en-IN')}</strong>
          </div>

          <div className={styles.receivingInputGroup}>
            <label>Amount Receiving (₹):</label>
            <input
              type="number"
              className={styles.receivingInput}
              value={receivingAmount}
              onChange={(e) => setReceivingAmount(Number(e.target.value))}
              required
            />
          </div>

          <div className={styles.summaryItem}>
            <span>Remaining Balance:</span>
            <strong className={remainingBalance > 0 ? styles.remValRed : styles.remValGreen}>
              ₹{remainingBalance.toLocaleString('en-IN')}
            </strong>
          </div>
        </div>

        {/* PAYMENT METHOD SELECTOR CARDS */}
        <div className={styles.sectionTitle} style={{ marginTop: 24 }}>3. Choose Payment Method Channel</div>
        <div className={styles.channelGrid}>
          {[
            { id: 'UPI', label: 'UPI / PhonePe / QR', icon: <QrCode size={18} /> },
            { id: 'CASH', label: 'Counter Cash', icon: <IndianRupee size={18} /> },
            { id: 'CARD', label: 'Credit/Debit Card POS', icon: <CreditCard size={18} /> },
            { id: 'CHEQUE', label: 'Bank Cheque', icon: <FileText size={18} /> },
            { id: 'BANK_TRANSFER', label: 'NEFT / RTGS Transfer', icon: <Building2 size={18} /> },
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              className={`${styles.channelBtn} ${paymentChannel === mode.id ? styles.channelActive : ''}`}
              onClick={() => setPaymentChannel(mode.id as PaymentChannel)}
            >
              {mode.icon}
              <span>{mode.label}</span>
            </button>
          ))}
        </div>

        {/* DYNAMIC REFERENCE INPUTS */}
        <div className={styles.referenceContainer}>
          {paymentChannel === 'CASH' && (
            <div className={styles.cashInfoBox}>
              <strong>💵 Counter Cash Collection:</strong> Cashier notes counter active. Instant receipt will be issued to parent upon cash handover.
            </div>
          )}

          {paymentChannel !== 'CASH' && paymentChannel !== 'CHEQUE' && (
            <div className={styles.refInputBox}>
              <label className={styles.label}>Transaction Ref / UTR / Auth Code</label>
              <input
                type="text"
                className={styles.input}
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
                placeholder="Enter Transaction Reference No..."
                required
              />
            </div>
          )}

          {paymentChannel === 'CHEQUE' && (
            <div className={styles.chequeGrid}>
              <div>
                <label className={styles.label}>Cheque Number</label>
                <input
                  type="text"
                  className={styles.input}
                  value={chequeNo}
                  onChange={(e) => setChequeNo(e.target.value)}
                  placeholder="e.g. CHQ-554433"
                  required
                />
              </div>
              <div>
                <label className={styles.label}>Drawee Bank Name</label>
                <input
                  type="text"
                  className={styles.input}
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. HDFC Bank"
                  required
                />
              </div>
              <div>
                <label className={styles.label}>Cheque Date</label>
                <input
                  type="date"
                  className={styles.input}
                  value={chequeDate}
                  onChange={(e) => setChequeDate(e.target.value)}
                  required
                />
              </div>
            </div>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <div className={styles.submitRow}>
          <button type="submit" className={styles.submitBtn}>
            <IndianRupee size={18} />
            <span>Process Payment & Generate Receipt (Ctrl+P)</span>
          </button>
        </div>
      </form>
    </div>
  );
};
