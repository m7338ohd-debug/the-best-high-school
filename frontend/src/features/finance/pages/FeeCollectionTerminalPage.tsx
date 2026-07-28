import React, { useState, useEffect } from 'react';
import { FourKpiDashboardHeader } from '../components/FourKpiDashboardHeader';
import { EnterpriseGlobalSearch } from '../components/EnterpriseGlobalSearch';
import { ClassCardsGrid } from '../components/ClassCardsGrid';
import { ClassCollectionWorkspace } from '../components/ClassCollectionWorkspace';
import { StudentFinanceProfileView } from '../components/StudentFinanceProfileView';
import { CompactPaymentModal } from '../components/CompactPaymentModal';
import { ReceiptAndCommunicationModal } from '../components/ReceiptAndCommunicationModal';

import { 
  initialDashboardKpis, 
  mockClassSummaries 
} from '../data/financeMockData';
import { 
  StudentFinancialProfile, 
  ClassSummaryCard, 
  FeeItem, 
  PaymentChannel 
} from '../types/finance.types';
import { 
  getStoredStudents, 
  getStoredFeePayments, 
  saveFeePaymentToStorage,
  saveStudentToStorage 
} from '../../../shared/utils/schoolDataStorage';
import styles from './FeeCollectionTerminalPage.module.css';

type TerminalViewMode = 'dashboard' | 'class-workspace' | 'student-profile';

export const FeeCollectionTerminalPage: React.FC = () => {
  const [kpiState, setKpiState] = useState(initialDashboardKpis);
  const [classSummaries, setClassSummaries] = useState<ClassSummaryCard[]>(mockClassSummaries);
  const [students, setStudents] = useState<StudentFinancialProfile[]>([]);

  // Navigation & Active Item States
  const [viewMode, setViewMode] = useState<TerminalViewMode>('dashboard');
  const [selectedClass, setSelectedClass] = useState<ClassSummaryCard | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentFinancialProfile | null>(null);

  // Dialog & Modal States
  const [activeCollectingFee, setActiveCollectingFee] = useState<FeeItem | null>(null);
  const [activeIssuedReceipt, setActiveIssuedReceipt] = useState<{
    receiptNo: string;
    student: StudentFinancialProfile;
    feeItem: FeeItem;
    receivingAmount: number;
    discountAmount: number;
    fineAmount: number;
    remainingBalance: number;
    paymentChannel: PaymentChannel;
    referenceNo: string;
  } | null>(null);

  // Load Real Data from Dynamic Storage
  const refreshData = () => {
    const stored = getStoredStudents();
    const payments = getStoredFeePayments();
    const todayStr = new Date().toISOString().split('T')[0];

    // Compute KPIs
    const todayPayments = payments.filter((p) => p.paymentDate === todayStr);
    const todayColl = todayPayments.reduce((acc, p) => acc + p.amountPaid, 0);
    const totalColl = payments.reduce((acc, p) => acc + p.amountPaid, 0);

    setKpiState({
      todayCollection: todayColl,
      monthlyCollection: totalColl,
      yearlyCollection: totalColl,
      studentsCollectedToday: todayPayments.length,
    });

    const normalizeClass = (name: string) => {
      if (!name) return '';
      return name.trim().toLowerCase().replace(/^(class|grade)\s*/i, '');
    };

    // Map stored student records to financial profiles
    const mappedProfiles: StudentFinancialProfile[] = stored.map((s) => {
      const isPaid = s.feeStatus === 'Paid';
      const studentPayments = payments.filter((p) => p.studentId === s.id || p.admissionNo === s.admissionNo);
      const totalPaidFromPayments = studentPayments.reduce((acc, p) => acc + p.amountPaid, 0);
      const totalPaid = isPaid ? 12000 : totalPaidFromPayments;
      const totalFees = 12000;
      const outstandingBalance = Math.max(0, totalFees - totalPaid);
      const currentFeeStatus = outstandingBalance === 0 ? 'Paid' : totalPaid > 0 ? 'Partially Paid' : 'Pending';

      return {
        id: s.id,
        admissionNo: s.admissionNo,
        rollNo: s.rollNo,
        studentName: s.studentName,
        className: s.className,
        sectionName: s.sectionName,
        academicYear: '2026-2027',
        parentName: s.parentName,
        parentRelation: s.parentRelation || 'Father',
        contact: s.contact,
        email: s.email,
        avatarUrl: s.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        status: (s.status === 'SUSPENDED' ? 'INACTIVE' : s.status) as 'ACTIVE' | 'INACTIVE',
        admissionDate: s.admissionDate,
        feeStatus: currentFeeStatus,
        totalFees: totalFees,
        totalPaid: totalPaid,
        outstandingBalance: outstandingBalance,
        discounts: 0,
        scholarships: 0,
        lateFine: 0,
        refunds: 0,
        lastPaymentDate: studentPayments[0]?.paymentDate || s.lastUpdated || todayStr,
        nextDueDate: '2026-08-15',
        assignedFees: [
          {
            id: `fee-${s.id}-1`,
            category: 'Tuition Fee - Term 2',
            monthTerm: 'Jul - Sep 2026',
            originalAmount: totalFees,
            discountAmount: 0,
            fineAmount: 0,
            amountPaid: totalPaid,
            balanceDue: outstandingBalance,
            dueDate: '2026-08-15',
            status: outstandingBalance === 0 ? 'PAID' : 'PENDING',
          },
        ],
      };
    });

    setStudents(mappedProfiles);

    // Compute Class Summaries using normalized class matching
    const updatedClassCards = mockClassSummaries.map((cCard) => {
      const classStudents = mappedProfiles.filter(
        (sp) => normalizeClass(sp.className) === normalizeClass(cCard.className)
      );
      const paid = classStudents.filter((sp) => sp.outstandingBalance === 0).length;
      const pending = classStudents.length - paid;
      const outSum = classStudents.reduce((acc, sp) => acc + sp.outstandingBalance, 0);

      return {
        ...cCard,
        totalStudents: classStudents.length,
        paidStudents: paid,
        pendingStudents: pending,
        outstandingFees: outSum,
      };
    });

    setClassSummaries(updatedClassCards);
  };

  useEffect(() => {
    refreshData();
  }, [viewMode]);

  // Handle Global Search Selection
  const handleGlobalSearchSelect = (student: StudentFinancialProfile) => {
    setSelectedStudent(student);
    setViewMode('student-profile');
  };

  // Handle Class Selection
  const handleSelectClass = (cls: ClassSummaryCard) => {
    setSelectedClass(cls);
    setViewMode('class-workspace');
  };

  // Handle Student Selection in Class Workspace
  const handleSelectStudentInClass = (student: StudentFinancialProfile) => {
    setSelectedStudent(student);
    setViewMode('student-profile');
  };

  // Handle Submit Payment from Compact Payment Dialog
  const handleSubmitPayment = (data: {
    feeItem: FeeItem;
    discountAmount: number;
    fineAmount: number;
    receivingAmount: number;
    paymentChannel: PaymentChannel;
    referenceNo: string;
  }) => {
    if (!selectedStudent) return;

    const receiptNo = `REC-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const recAmt = data.receivingAmount;
    const remainingBalance = Math.max(0, selectedStudent.outstandingBalance - recAmt);
    const todayStr = new Date().toISOString().split('T')[0];

    // Save Fee Payment to Master Storage
    saveFeePaymentToStorage({
      id: `pay-${Date.now()}`,
      receiptNo,
      studentId: selectedStudent.id,
      studentName: selectedStudent.studentName,
      admissionNo: selectedStudent.admissionNo,
      className: selectedStudent.className,
      sectionName: selectedStudent.sectionName,
      parentName: selectedStudent.parentName,
      contact: selectedStudent.contact,
      feeCategory: data.feeItem.category,
      amountPaid: recAmt,
      fineAmount: data.fineAmount,
      remainingBalance,
      paymentChannel: data.paymentChannel,
      referenceNo: data.referenceNo,
      collectedBy: 'Accountant',
      paymentDate: todayStr,
    });

    // Update Student Record in Storage
    const stored = getStoredStudents();
    const targetStudent = stored.find((s) => s.id === selectedStudent.id || s.admissionNo === selectedStudent.admissionNo);
    if (targetStudent) {
      saveStudentToStorage({
        ...targetStudent,
        feeStatus: remainingBalance === 0 ? 'Paid' : 'Partial',
        lastUpdated: todayStr,
      });
    }

    const updatedStudent: StudentFinancialProfile = {
      ...selectedStudent,
      outstandingBalance: remainingBalance,
      totalPaid: selectedStudent.totalPaid + recAmt,
      feeStatus: remainingBalance === 0 ? 'Paid' : 'Partially Paid',
      lastPaymentDate: todayStr,
      assignedFees: selectedStudent.assignedFees.map((f) =>
        f.id === data.feeItem.id
          ? { 
              ...f, 
              status: remainingBalance === 0 ? 'PAID' : 'PENDING', 
              balanceDue: remainingBalance, 
              amountPaid: (f.amountPaid || 0) + recAmt 
            }
          : f
      ),
    };

    setSelectedStudent(updatedStudent);

    // Close Payment Modal & Open Receipt Modal
    setActiveCollectingFee(null);
    setActiveIssuedReceipt({
      receiptNo,
      student: updatedStudent,
      feeItem: data.feeItem,
      receivingAmount: recAmt,
      discountAmount: data.discountAmount,
      fineAmount: data.fineAmount,
      remainingBalance,
      paymentChannel: data.paymentChannel,
      referenceNo: data.referenceNo,
    });

    refreshData();
  };

  return (
    <div className={styles.container}>
      {/* 1. TOP DASHBOARD KPI CARDS */}
      <FourKpiDashboardHeader
        todayCollection={kpiState.todayCollection}
        monthlyCollection={kpiState.monthlyCollection}
        yearlyCollection={kpiState.yearlyCollection}
        studentsCollectedToday={kpiState.studentsCollectedToday}
      />

      {/* 2. GLOBAL ENTERPRISE SEARCH */}
      <EnterpriseGlobalSearch
        students={students}
        onSelectStudent={handleGlobalSearchSelect}
      />

      {/* VIEW MODE 1: DASHBOARD VIEW (CLASS CARDS GRID) */}
      {viewMode === 'dashboard' && (
        <ClassCardsGrid
          classes={classSummaries}
          onSelectClass={handleSelectClass}
        />
      )}

      {/* VIEW MODE 2: CLASS WORKSPACE VIEW (ROSTER) */}
      {viewMode === 'class-workspace' && selectedClass && (
        <ClassCollectionWorkspace
          selectedClass={selectedClass}
          students={students}
          onBackToDashboard={() => setViewMode('dashboard')}
          onSelectStudent={handleSelectStudentInClass}
        />
      )}

      {/* VIEW MODE 3: STUDENT FINANCIAL PROFILE WORKSPACE */}
      {viewMode === 'student-profile' && selectedStudent && (
        <StudentFinanceProfileView
          student={selectedStudent}
          onBack={() => {
            if (selectedClass) setViewMode('class-workspace');
            else setViewMode('dashboard');
          }}
          onCollectFee={(fee) => setActiveCollectingFee(fee)}
        />
      )}

      {/* COMPACT PAYMENT COLLECTION DIALOG */}
      {activeCollectingFee && selectedStudent && (
        <CompactPaymentModal
          feeItem={activeCollectingFee}
          studentName={selectedStudent.studentName}
          admissionNo={selectedStudent.admissionNo}
          onClose={() => setActiveCollectingFee(null)}
          onSubmitPayment={handleSubmitPayment}
        />
      )}

      {/* RECEIPT PREVIEW & AUTO PARENT COMMUNICATION MODAL */}
      {activeIssuedReceipt && (
        <ReceiptAndCommunicationModal
          receiptNo={activeIssuedReceipt.receiptNo}
          student={activeIssuedReceipt.student}
          feeItem={activeIssuedReceipt.feeItem}
          receivingAmount={activeIssuedReceipt.receivingAmount}
          discountAmount={activeIssuedReceipt.discountAmount}
          fineAmount={activeIssuedReceipt.fineAmount}
          remainingBalance={activeIssuedReceipt.remainingBalance}
          paymentChannel={activeIssuedReceipt.paymentChannel}
          referenceNo={activeIssuedReceipt.referenceNo}
          onClose={() => setActiveIssuedReceipt(null)}
          onCollectAnother={() => {
            setActiveIssuedReceipt(null);
            setViewMode('dashboard');
          }}
        />
      )}
    </div>
  );
};
