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
  ShieldCheck,
  Heart
} from 'lucide-react';
import styles from './ReceiptAndCommunicationModal.module.css';

interface ReceiptAndCommunicationModalProps {
  receiptNo: string;
  student: StudentFinancialProfile;
  feeItem: FeeItem;
  receivingAmount: number;
  discountAmount: number;
  fineAmount: number;
  remainingBalance: number;
  paymentChannel: PaymentChannel;
  referenceNo: string;
  onClose: () => void;
  onCollectAnother: () => void;
}

export const ReceiptAndCommunicationModal: React.FC<ReceiptAndCommunicationModalProps> = ({
  receiptNo,
  student,
  feeItem,
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

  const thankYouNote = `Thank you for your fee payment! We sincerely appreciate your prompt payment and continued partnership in your child's education at ${profile.schoolName}.`;

  // Function to build plain text receipt content
  const generateReceiptText = () => {
    return `
===================================================================
${profile.schoolName.toUpperCase()}
${profile.tagline || 'Official Fee Payment Receipt'}
Affiliation: ${profile.affiliationNo || 'AFF-1930482'}
Address: ${profile.address}
===================================================================
Receipt Number: ${receiptNo}
Date & Time:    ${currentDate}

STUDENT INFORMATION:
Student Name:   ${student.studentName}
Admission No:   ${student.admissionNo}
Class & Sec:    ${student.className} (${student.sectionName}) • Roll #${student.rollNo}
Parent Name:    ${student.parentName} (${student.contact})

FEE PAYMENT BREAKDOWN:
- ${feeItem.category} (${feeItem.monthTerm}): ₹${feeItem.balanceDue.toLocaleString('en-IN')}
${fineAmount > 0 ? `Add: Overdue Late Fine: +₹${fineAmount.toLocaleString('en-IN')}\n` : ''}
-------------------------------------------------------------------
TOTAL AMOUNT RECEIVED: ₹${receivingAmount.toLocaleString('en-IN')}
Payment Channel:       ${paymentChannel} (Ref: ${referenceNo})
REMAINING OUTSTANDING: ₹${remainingBalance.toLocaleString('en-IN')}
===================================================================
${thankYouNote}
===================================================================
Computer Generated ERP Receipt • Authorized Accountant Signoff
===================================================================
    `.trim();
  };



  // Action Dispatch Handlers (WhatsApp, Email, SMS, Download, Print)
  const handleAction = (type: string) => {
    const summaryText = `Dear ${student.parentName}, fee payment of ₹${receivingAmount.toLocaleString('en-IN')} for ${student.studentName} (${student.className}-${student.sectionName}) has been received via ${paymentChannel}. Receipt No: ${receiptNo}. Remaining Outstanding: ₹${remainingBalance.toLocaleString('en-IN')}. ${thankYouNote}`;

    if (type === 'PRINT') {
      window.print();
    } else if (type === 'DOWNLOAD') {
      const receiptContent = generateReceiptText();
      const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Receipt_${receiptNo}_${student.admissionNo}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDispatchStatus(`Receipt ${receiptNo} downloaded!`);
      setTimeout(() => setDispatchStatus(null), 3000);
    } else if (type === 'WHATSAPP') {
      const cleanPhone = student.contact.replace(/[^0-9]/g, '');
      const encodedMsg = encodeURIComponent(summaryText);
      window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMsg}`, '_blank');
      setDispatchStatus(`Opening Direct WhatsApp to Parent (${student.contact})...`);
      setTimeout(() => setDispatchStatus(null), 3000);
    } else if (type === 'EMAIL') {
      const subject = encodeURIComponent(`Official Fee Receipt ${receiptNo} - ${profile.schoolName}`);
      const body = encodeURIComponent(summaryText);
      window.open(`mailto:${student.email}?subject=${subject}&body=${body}`, '_blank');
      setDispatchStatus(`Opening Email App for Parent (${student.email})...`);
      setTimeout(() => setDispatchStatus(null), 3000);
    } else if (type === 'SMS') {
      const cleanPhone = student.contact.replace(/[^0-9]/g, '');
      const body = encodeURIComponent(summaryText);
      window.open(`sms:${cleanPhone}?body=${body}`, '_blank');
      setDispatchStatus(`Opening Direct SMS to Parent (${student.contact})...`);
      setTimeout(() => setDispatchStatus(null), 3000);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modalCard}>
        {/* SUCCESS BANNER */}
        <div className={styles.successBanner}>
          <div className={styles.checkIconBadge}>
            <CheckCircle2 size={32} />
          </div>
          <div>
            <h2 className={styles.bannerTitle}>Payment Received & Receipt Issued!</h2>
            <p className={styles.bannerSub}>
              Receipt: <strong>{receiptNo}</strong> • Remaining Balance: <strong style={{ color: remainingBalance > 0 ? '#fef08a' : '#86efac' }}>₹{remainingBalance.toLocaleString('en-IN')}</strong>
            </p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
        </div>

        {/* AUTO PARENT COMMUNICATION ALERT */}
        <div className={styles.autoNotifyBar}>
          <Sparkles size={16} />
          <span>Fee payment updated & receipt ready for printing or parent notification</span>
        </div>

        {dispatchStatus && (
          <div className={styles.dispatchAlert}>
            <CheckCircle2 size={14} /> {dispatchStatus}
          </div>
        )}

        {/* RECEIPT PREVIEW SHEET */}
        <div className={styles.receiptSheet} id="printableReceipt">
          <div className={styles.sheetHeader}>
            <div className={styles.schoolLogoBox}>
              {profile.logoUrl ? (
                <img src={profile.logoUrl} alt="Logo" style={{ width: 36, height: 36, objectFit: 'contain' }} />
              ) : (
                <Receipt size={24} />
              )}
              <div>
                <h3 className={styles.schoolName}>{profile.schoolName.toUpperCase()}</h3>
                <span className={styles.schoolSub}>Affiliation No. {profile.affiliationNo || '1930482'} • Reg. ERP Finance System</span>
              </div>
            </div>

            <div className={styles.receiptMeta}>
              <div className={styles.rcNo}>{receiptNo}</div>
              <span className={styles.rcDate}>{currentDate}</span>
            </div>
          </div>

          <div className={styles.studentInfoGrid}>
            <div><span className={styles.infoLabel}>Student Name:</span> <strong>{student.studentName}</strong></div>
            <div><span className={styles.infoLabel}>Admission No:</span> <strong>{student.admissionNo}</strong></div>
            <div><span className={styles.infoLabel}>Class & Section:</span> <strong>{student.className} ({student.sectionName}) • Roll #{student.rollNo}</strong></div>
            <div><span className={styles.infoLabel}>Parent / Guardian:</span> <strong>{student.parentName} ({student.contact})</strong></div>
          </div>

          <table className={styles.itemTable}>
            <thead>
              <tr>
                <th>Fee Head / Description</th>
                <th>Month / Term</th>
                <th style={{ textAlign: 'right' }}>Amount Paid (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>{feeItem.category}</strong></td>
                <td>{feeItem.monthTerm}</td>
                <td style={{ textAlign: 'right', fontWeight: 800 }}>₹{feeItem.balanceDue.toLocaleString('en-IN')}</td>
              </tr>
              {fineAmount > 0 && (
                <tr className={styles.fineRow}>
                  <td colSpan={2}>Add: Overdue Late Fine Surcharge</td>
                  <td style={{ textAlign: 'right', color: '#dc2626', fontWeight: 800 }}>+₹{fineAmount.toLocaleString('en-IN')}</td>
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

          {/* THANK YOU NOTE & REMAINING BALANCE ROW */}
          <div style={{ marginTop: 14, padding: 12, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 11, color: '#475569', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Heart size={14} color="#7e22ce" />
              <span>{thankYouNote}</span>
            </div>
            <div style={{ textAlign: 'right', whiteSpace: 'nowrap', marginLeft: 16 }}>
              <span style={{ fontSize: 10, color: '#64748b', display: 'block', fontWeight: 600 }}>Remaining Balance:</span>
              <strong style={{ fontSize: 14, color: remainingBalance > 0 ? '#dc2626' : '#16a34a', fontWeight: 800 }}>
                ₹{remainingBalance.toLocaleString('en-IN')}
              </strong>
            </div>
          </div>

          <div className={styles.sheetFooter}>
            <div className={styles.footerAudit}>
              <ShieldCheck size={16} />
              <span>Computer Generated ERP Receipt • Authorized Accountant Signoff</span>
            </div>
          </div>
        </div>

        {/* BUTTONS WITH DIRECT WHATSAPP / EMAIL / SMS & DOWNLOAD */}
        <div className={styles.actionToolbar}>
          <button className={styles.btnPrimary} onClick={() => handleAction('PRINT')}>
            <Printer size={16} /> Print Receipt
          </button>
          <button className={styles.btnSecondary} onClick={() => handleAction('DOWNLOAD')}>
            <Download size={16} /> Download Receipt
          </button>
          <button className={styles.btnSecondary} style={{ background: '#25D366', color: '#fff', border: 'none' }} onClick={() => handleAction('WHATSAPP')}>
            <Share2 size={16} /> WhatsApp Parent
          </button>
          <button className={styles.btnSecondary} onClick={() => handleAction('EMAIL')}>
            <Mail size={16} /> Email Parent
          </button>
          <button className={styles.btnSecondary} onClick={() => handleAction('SMS')}>
            <MessageSquare size={16} /> SMS Parent
          </button>
        </div>

        <div className={styles.footerRow}>
          <button className={styles.btnOutline} onClick={onCollectAnother}>
            <span>Collect Another Payment</span> <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
