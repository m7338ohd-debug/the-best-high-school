import React, { useState } from 'react';
import { FeeItem, PaymentChannel } from '../types/finance.types';
import { IndianRupee, QrCode, CreditCard, FileText, Building2, Wallet, X } from 'lucide-react';
import styles from './CompactPaymentModal.module.css';

interface CompactPaymentModalProps {
  feeItem: FeeItem;
  studentName: string;
  admissionNo: string;
  onClose: () => void;
  onSubmitPayment: (data: {
    feeItem: FeeItem;
    discountAmount: number;
    scholarshipAmount: number;
    fineAmount: number;
    receivingAmount: number;
    paymentChannel: PaymentChannel;
    referenceNo: string;
    chequeDetails?: { chequeNo: string; bankName: string; chequeDate: string };
  }) => void;
}

export const CompactPaymentModal: React.FC<CompactPaymentModalProps> = ({
  feeItem,
  studentName,
  admissionNo,
  onClose,
  onSubmitPayment,
}) => {
  const [fineAmount, setFineAmount] = useState(0);
  const [paymentChannel, setPaymentChannel] = useState<PaymentChannel>('UPI');
  
  // Math Calculations: Original Fee + Late Fine Surcharge (+)
  const netOutstanding = Math.max(0, feeItem.balanceDue + fineAmount);
  const [receivingAmount, setReceivingAmount] = useState(netOutstanding);

  // Live remaining balance as user types receivingAmount
  const remainingBalance = Math.max(0, netOutstanding - receivingAmount);

  const [refNo, setRefNo] = useState('UPI-88492018');
  const [chequeNo, setChequeNo] = useState('CHQ-992211');
  const [bankName, setBankName] = useState('HDFC Bank');
  const [chequeDate, setChequeDate] = useState('2026-07-28');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitPayment({
      feeItem,
      discountAmount: 0,
      scholarshipAmount: 0,
      fineAmount,
      receivingAmount,
      paymentChannel,
      referenceNo: refNo,
      chequeDetails: paymentChannel === 'CHEQUE' ? { chequeNo, bankName, chequeDate } : undefined,
    });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modalCard}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>Collect Fee - {feeItem.category}</h3>
            <span className={styles.studentSub}>
              Student: <strong>{studentName}</strong> ({admissionNo})
            </span>
          </div>
          <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* CALCULATOR SUMMARY GRID */}
          <div className={styles.calcGrid}>
            <div className={styles.inputBox}>
              <label className={styles.label}>Original Fee (₹)</label>
              <input type="number" className={styles.readOnlyInput} value={feeItem.balanceDue} readOnly />
            </div>

            <div className={styles.inputBox}>
              <label className={styles.label}>Late Fine Surcharge (+₹)</label>
              <input
                type="number"
                className={styles.input}
                value={fineAmount}
                onChange={(e) => setFineAmount(Number(e.target.value))}
              />
            </div>

            <div className={styles.inputBox} style={{ gridColumn: '1 / -1' }}>
              <label className={styles.label}>Total Payable Outstanding (₹)</label>
              <input type="number" className={styles.netInput} value={netOutstanding} readOnly />
            </div>
          </div>

          {/* LIVE RECEIVING AMOUNT & REMAINING OUTSTANDING DUES */}
          <div className={styles.receivingBar}>
            <div>
              <label className={styles.receivingLabel}>Amount Receiving from Parent (₹):</label>
              <input
                type="number"
                className={styles.receivingInput}
                value={receivingAmount}
                onChange={(e) => setReceivingAmount(Number(e.target.value))}
                required
              />
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 11, color: '#64748b', display: 'block', fontWeight: 600 }}>Remaining Balance:</span>
              <strong style={{ fontSize: '1.15rem', color: remainingBalance > 0 ? '#dc2626' : '#16a34a', fontWeight: 900 }}>
                ₹{remainingBalance.toLocaleString('en-IN')}
              </strong>
            </div>
          </div>

          {/* PAYMENT METHOD SELECTOR CARDS */}
          <div className={styles.sectionTitle}>Choose Payment Method</div>
          <div className={styles.methodsGrid}>
            {[
              { id: 'CASH', label: 'Cash', icon: <IndianRupee size={16} /> },
              { id: 'UPI', label: 'UPI / QR', icon: <QrCode size={16} /> },
              { id: 'CARD', label: 'Card POS', icon: <CreditCard size={16} /> },
              { id: 'BANK_TRANSFER', label: 'Bank Transfer', icon: <Building2 size={16} /> },
              { id: 'CHEQUE', label: 'Cheque', icon: <FileText size={16} /> },
              { id: 'WALLET', label: 'Wallet', icon: <Wallet size={16} /> },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                className={`${styles.methodBtn} ${paymentChannel === m.id ? styles.activeMethod : ''}`}
                onClick={() => setPaymentChannel(m.id as PaymentChannel)}
              >
                {m.icon}
                <span>{m.label}</span>
              </button>
            ))}
          </div>

          {/* DYNAMIC FIELDS */}
          <div className={styles.dynamicFields}>
            {paymentChannel === 'CASH' && (
              <div className={styles.cashNotice}>
                💵 Cash Counter Collection: No reference number required. Receipt will be generated immediately.
              </div>
            )}

            {paymentChannel === 'UPI' && (
              <div className={styles.inputBox}>
                <label className={styles.label}>UPI Transaction ID / UTR Ref Number</label>
                <input
                  type="text"
                  className={styles.input}
                  value={refNo}
                  onChange={(e) => setRefNo(e.target.value)}
                  placeholder="Enter UPI Reference ID..."
                  required
                />
              </div>
            )}

            {paymentChannel === 'CARD' && (
              <div className={styles.inputBox}>
                <label className={styles.label}>Card POS Transaction ID / Approval Code</label>
                <input
                  type="text"
                  className={styles.input}
                  value={refNo}
                  onChange={(e) => setRefNo(e.target.value)}
                  placeholder="Enter Card POS Auth Code..."
                  required
                />
              </div>
            )}

            {paymentChannel === 'BANK_TRANSFER' && (
              <div className={styles.inputBox}>
                <label className={styles.label}>Bank UTR Reference Number</label>
                <input
                  type="text"
                  className={styles.input}
                  value={refNo}
                  onChange={(e) => setRefNo(e.target.value)}
                  placeholder="Enter NEFT/RTGS UTR Number..."
                  required
                />
              </div>
            )}

            {paymentChannel === 'CHEQUE' && (
              <div className={styles.chequeGrid}>
                <div className={styles.inputBox}>
                  <label className={styles.label}>Cheque Number</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={chequeNo}
                    onChange={(e) => setChequeNo(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.inputBox}>
                  <label className={styles.label}>Drawee Bank Name</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.inputBox}>
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

          <div className={styles.submitRow}>
            <button type="submit" className={styles.submitBtn}>
              <IndianRupee size={16} /> Collect Payment & Issue Receipt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
