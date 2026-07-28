import React, { useState, useEffect } from 'react';
import { StudentFinancialProfile, FeeItem } from '../types/finance.types';
import { 
  ArrowLeft, 
  DollarSign, 
  Plus, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';
import styles from './StudentFinanceProfileView.module.css';

interface StudentFinanceProfileViewProps {
  student: StudentFinancialProfile;
  onBack: () => void;
  onCollectFee: (feeItem: FeeItem) => void;
}

export const StudentFinanceProfileView: React.FC<StudentFinanceProfileViewProps> = ({
  student,
  onBack,
  onCollectFee,
}) => {
  const [assignedFees, setAssignedFees] = useState<FeeItem[]>(student.assignedFees);
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    setAssignedFees(student.assignedFees);
  }, [student]);
  const [newFeeCategory, setNewFeeCategory] = useState('Annual Library & Sports Fee');
  const [newFeeAmount, setNewFeeAmount] = useState(150);

  const handleAssignFee = (e: React.FormEvent) => {
    e.preventDefault();
    const newFee: FeeItem = {
      id: `fee-manual-${Date.now()}`,
      category: newFeeCategory,
      monthTerm: 'Academic Year 2026',
      originalAmount: newFeeAmount,
      discountAmount: 0,
      fineAmount: 0,
      amountPaid: 0,
      balanceDue: newFeeAmount,
      dueDate: '2026-08-30',
      status: 'PENDING',
    };

    setAssignedFees((prev) => [...prev, newFee]);
    setShowAssignModal(false);
  };

  return (
    <div className={styles.container}>
      {/* HEADER BREADCRUMB */}
      <header className={styles.header}>
        <div>
          <button className={styles.backLink} onClick={onBack}>
            <ArrowLeft size={14} /> Back to Class Workspace
          </button>
          <div className={styles.titleRow}>
            <img
              src={student.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={student.studentName}
              className={styles.headerAvatar}
            />
            <div>
              <div className={styles.nameBadges}>
                <h1 className={styles.title}>{student.studentName}</h1>
                <code className={styles.admCode}>{student.admissionNo}</code>
                <span className={styles.statusPill}>{student.status}</span>
              </div>
              <p className={styles.subtitle}>
                {student.className} Section {student.sectionName} • Roll #{student.rollNo} • Academic Year {student.academicYear}
              </p>
            </div>
          </div>
        </div>

        <button className={styles.assignFeeBtn} onClick={() => setShowAssignModal(true)}>
          <Plus size={16} /> Assign Manual Fee
        </button>
      </header>

      {/* STUDENT PROFILE INFORMATION BAR */}
      <div className={styles.profileInfoBar}>
        <div className={styles.infoCol}>
          <span className={styles.infoLabel}>Parent / Guardian</span>
          <strong className={styles.infoVal}>{student.parentName} ({student.parentRelation})</strong>
        </div>
        <div className={styles.infoCol}>
          <span className={styles.infoLabel}>Phone Number</span>
          <strong className={styles.infoVal}>{student.contact}</strong>
        </div>
        <div className={styles.infoCol}>
          <span className={styles.infoLabel}>Email Address</span>
          <strong className={styles.infoVal}>{student.email}</strong>
        </div>
        <div className={styles.infoCol}>
          <span className={styles.infoLabel}>Admission Date</span>
          <strong className={styles.infoVal}>{student.admissionDate}</strong>
        </div>
        <div className={styles.infoCol}>
          <span className={styles.infoLabel}>Last Payment Date</span>
          <strong className={styles.infoVal}>{student.lastPaymentDate}</strong>
        </div>
        <div className={styles.infoCol}>
          <span className={styles.infoLabel}>Next Due Date</span>
          <strong className={styles.infoValRed}>{student.nextDueDate}</strong>
        </div>
      </div>

      {/* FINANCE SUMMARY CARDS */}
      <div className={styles.financeSummaryGrid}>
        <div className={styles.summaryCard}>
          <span className={styles.sLabel}>Total Term Fees</span>
          <strong className={styles.sVal}>₹{student.totalFees.toLocaleString('en-IN')}</strong>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.sLabel}>Total Paid</span>
          <strong className={styles.sValGreen}>₹{student.totalPaid.toLocaleString('en-IN')}</strong>
        </div>
        <div className={styles.summaryCardHighlight}>
          <span className={styles.sLabelHighlight}>Outstanding Dues</span>
          <strong className={styles.sValHighlight}>₹{student.outstandingBalance.toLocaleString('en-IN')}</strong>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.sLabel}>Late Fine Surcharge</span>
          <strong className={styles.sValRed}>₹{student.lateFine.toLocaleString('en-IN')}</strong>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.sLabel}>Refunds</span>
          <strong className={styles.sValSlate}>₹{student.refunds.toLocaleString('en-IN')}</strong>
        </div>
      </div>

      {/* ASSIGNED FEE CARDS SECTION */}
      <div className={styles.feeSection}>
        <div className={styles.feeHeader}>
          <h3 className={styles.feeTitle}>Assigned Fee Dues & Ledger Cards</h3>
          <span className={styles.badgePurple}><Sparkles size={13} /> {assignedFees.length} Assigned Fee Head Items</span>
        </div>

        <div className={styles.feeCardsList}>
          {assignedFees.map((fee) => {
            const isPaid = fee.status === 'PAID';
            return (
              <div key={fee.id} className={styles.feeItemCard}>
                <div className={styles.feeMain}>
                  <div className={styles.feeTitleRow}>
                    <h4 className={styles.categoryName}>{fee.category}</h4>
                    <span className={`${styles.statusBadge} ${styles[fee.status]}`}>{fee.status}</span>
                  </div>
                  <p className={styles.termMeta}>{fee.monthTerm} • Due Date: {fee.dueDate}</p>
                </div>

                <div className={styles.feeRight}>
                  <div className={styles.amountBox}>
                    <span className={styles.amtLabel}>Balance Due</span>
                    <strong className={fee.balanceDue > 0 ? styles.amtDueRed : styles.amtPaidGreen}>
                      ₹{fee.balanceDue.toLocaleString('en-IN')}
                    </strong>
                  </div>

                  {!isPaid ? (
                    <button
                      className={styles.collectBtn}
                      onClick={() => onCollectFee(fee)}
                    >
                      <DollarSign size={16} /> Collect Fee
                    </button>
                  ) : (
                    <span className={styles.completedTag}>
                      <CheckCircle2 size={16} /> Completed
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MANUAL FEE ASSIGNMENT MODAL */}
      {showAssignModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <h3 className={styles.modalTitle}>Assign Manual Fee to {student.studentName}</h3>
            <form onSubmit={handleAssignFee}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Fee Category Name</label>
                <input
                  type="text"
                  className={styles.modalInput}
                  value={newFeeCategory}
                  onChange={(e) => setNewFeeCategory(e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputGroup} style={{ marginTop: 14 }}>
                <label className={styles.inputLabel}>Fee Amount (₹)</label>
                <input
                  type="number"
                  className={styles.modalInput}
                  value={newFeeAmount}
                  onChange={(e) => setNewFeeAmount(Number(e.target.value))}
                  required
                />
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowAssignModal(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitAssignBtn}>
                  Assign Fee Head
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
