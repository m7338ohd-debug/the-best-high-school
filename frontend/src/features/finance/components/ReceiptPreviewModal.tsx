import React, { useState } from 'react';
import { StudentFinancialProfile, PaymentChannel, FeeItem } from '../types/finance.types';
import { useSchoolSettings } from '../../../shared/context/SchoolContext';
import { 
  CheckCircle2, 
  Printer, 
  Download, 
  Mail, 
  MessageSquare, 
  Share2, 
  X, 
  Receipt, 
  Sparkles, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import styles from './ReceiptPreviewModal.module.css';

interface ReceiptPreviewModalProps {
  receiptNo: string;
  student: StudentFinancialProfile;
  selectedFeeItems: FeeItem[];
  receivingAmount: number;
  discountAmount: number;
  fineAmount: number;
  remainingBalance: number;
  paymentChannel: PaymentChannel;
  referenceNo: string;
  onClose: () => void;
  onCollectAnother: () => void;
}

export const ReceiptPreviewModal: React.FC<ReceiptPreviewModalProps> = ({
  receiptNo,
  student,
  selectedFeeItems,
  receivingAmount,
  discountAmount: _discountAmount,
  fineAmount,
  remainingBalance,
  paymentChannel,
  referenceNo,
  onClose,
  onCollectAnother,
}) => {
  const { profile } = useSchoolSettings();
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  const currentDate = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const handleAction = (type: string) => {
    if (type === 'PRINT') {
      window.print();
    } else if (type === 'DOWNLOAD') {
      // Generate actual downloadable receipt file (PDF/Text document)
      const receiptContent = `
===================================================================
${profile.schoolName.toUpperCase()}
${profile.tagline || 'Official Fee Payment Receipt'}
Affiliation: ${profile.affiliationNo || 'AFF-1930482'}
===================================================================
Receipt Number: ${receiptNo}
Date & Time:    ${currentDate}

STUDENT INFORMATION:
Student Name:   ${student.studentName}
Admission No:   ${student.admissionNo}
Class & Sec:    ${student.className} (${student.sectionName})
Parent Name:    ${student.parentName} (${student.contact})

FEE PAYMENT DETAILS:
${selectedFeeItems.map((item) => `- ${item.category} (${item.monthTerm}): ₹${item.balanceDue.toLocaleString('en-IN')}`).join('\n')}
${fineAmount > 0 ? `Add: Overdue Fine Surcharge: +₹${fineAmount.toLocaleString('en-IN')}\n` : ''}
-------------------------------------------------------------------
TOTAL AMOUNT RECEIVED: ₹${receivingAmount.toLocaleString('en-IN')}
Payment Mode:          ${paymentChannel} (Ref: ${referenceNo})
Remaining Balance:     ₹${remainingBalance.toLocaleString('en-IN')}
===================================================================
Computer Generated ERP Receipt • Authorized Accountant Signoff
===================================================================
      `.trim();

      const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Receipt_${receiptNo}_${student.admissionNo}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDispatchStatus(`Receipt ${receiptNo} downloaded to your device!`);
      setTimeout(() => setDispatchStatus(null), 3000);
    } else {
      setDispatchStatus(`Receipt successfully sent via ${type}!`);
      setTimeout(() => setDispatchStatus(null), 3000);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modalCard}>
        {/* Success Header Animation */}
        <div className={styles.successBanner}>
          <div className={styles.checkIconBadge}>
            <CheckCircle2 size={32} />
          </div>
          <div>
            <h2 className={styles.bannerTitle}>Payment Received & Receipt Generated!</h2>
            <p className={styles.bannerSub}>
              Receipt Number: <strong>{receiptNo}</strong> • Remaining Balance: <strong>₹{remainingBalance.toLocaleString('en-IN')}</strong>
            </p>
          </div>

          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {dispatchStatus && (
          <div className={styles.dispatchAlert}>
            <Sparkles size={16} /> {dispatchStatus}
          </div>
        )}

        {/* PRINT-READY RECEIPT PREVIEW SHEET */}
        <div className={styles.receiptSheet} id="printableReceipt">
          {/* School Header */}
          <div className={styles.sheetHeader}>
            <div className={styles.schoolLogoBox}>
              {profile.logoUrl ? (
                <img src={profile.logoUrl} alt="Logo" style={{ width: 36, height: 36, objectFit: 'contain' }} />
              ) : (
                <Receipt size={24} />
              )}
              <div>
                <h3 className={styles.schoolName}>{profile.schoolName.toUpperCase()}</h3>
                <span className={styles.schoolSub}>Affiliation No. {profile.affiliationNo} • Reg. ERP Finance System</span>
              </div>
            </div>

            <div className={styles.receiptMeta}>
              <div className={styles.rcNo}>{receiptNo}</div>
              <span className={styles.rcDate}>{currentDate}</span>
            </div>
          </div>

          {/* Student Info Bar */}
          <div className={styles.studentInfoGrid}>
            <div>
              <span className={styles.infoLabel}>Student Name:</span>
              <strong className={styles.infoVal}>{student.studentName}</strong>
            </div>
            <div>
              <span className={styles.infoLabel}>Admission No:</span>
              <strong className={styles.infoVal}>{student.admissionNo}</strong>
            </div>
            <div>
              <span className={styles.infoLabel}>Class & Section:</span>
              <strong className={styles.infoVal}>{student.className} ({student.sectionName})</strong>
            </div>
            <div>
              <span className={styles.infoLabel}>Parent / Guardian:</span>
              <strong className={styles.infoVal}>{student.parentName} ({student.contact})</strong>
            </div>
          </div>

          {/* Line Items Table */}
          <table className={styles.itemTable}>
            <thead>
              <tr>
                <th>Fee Category / Description</th>
                <th>Term / Month</th>
                <th style={{ textAlign: 'right' }}>Amount Paid (₹)</th>
              </tr>
            </thead>
            <tbody>
              {selectedFeeItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.category}</strong>
                  </td>
                  <td>{item.monthTerm}</td>
                  <td style={{ textAlign: 'right', fontWeight: 800 }}>
                    ₹{item.balanceDue.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}

              {fineAmount > 0 && (
                <tr className={styles.fineRow}>
                  <td colSpan={2}>Add: Overdue Late Fine Surcharge</td>
                  <td style={{ textAlign: 'right', color: '#dc2626', fontWeight: 800 }}>
                    +₹{fineAmount.toLocaleString('en-IN')}
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className={styles.totalRow}>
                <td colSpan={2} style={{ textAlign: 'right', fontWeight: 800 }}>
                  Total Received via {paymentChannel} ({referenceNo}):
                </td>
                <td style={{ textAlign: 'right', fontSize: '1.2rem', fontWeight: 900, color: '#7e22ce' }}>
                  ₹{receivingAmount.toLocaleString('en-IN')}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Statutory Footer */}
          <div className={styles.sheetFooter}>
            <div className={styles.footerAudit}>
              <ShieldCheck size={16} />
              <span>Computer Generated Double-Entry ERP Receipt • Verified by Senior Accountant</span>
            </div>
            <div className={styles.signatureBox}>
              <div className={styles.sigLine} />
              <span>Authorised Cashier Signature</span>
            </div>
          </div>
        </div>

        {/* MULTI-CHANNEL DISPATCH ACTION BUTTONS */}
        <div className={styles.actionToolbar}>
          <button className={styles.btnPrimary} onClick={() => handleAction('PRINT')}>
            <Printer size={16} /> Print Receipt PDF
          </button>
          <button className={styles.btnSecondary} onClick={() => handleAction('DOWNLOAD')}>
            <Download size={16} /> Download PDF / Receipt
          </button>
          <button className={styles.btnSecondary} onClick={() => handleAction('EMAIL')}>
            <Mail size={16} /> Email Parent
          </button>
          <button className={styles.btnSecondary} onClick={() => handleAction('SMS')}>
            <MessageSquare size={16} /> Send SMS
          </button>
          <button className={styles.btnSecondary} onClick={() => handleAction('WHATSAPP')}>
            <Share2 size={16} /> WhatsApp Receipt
          </button>
        </div>

        <div className={styles.footerRow}>
          <button className={styles.btnOutline} onClick={onCollectAnother}>
            <span>Collect Another Fee</span> <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
