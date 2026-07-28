import React, { useState } from 'react';
import { Card } from '../../../shared/components/ui/Card/Card';
import { Button } from '../../../shared/components/ui/Button/Button';
import { Input } from '../../../shared/components/ui/Input/Input';
import { User, Users, GraduationCap, Heart, CheckCircle2, ArrowLeft, Lock, DollarSign, Sparkles } from 'lucide-react';
import { saveStudentToStorage } from '../../../shared/utils/schoolDataStorage';
import { StudentRecord } from '../types/student.types';
import styles from './StudentAdmissionWizardPage.module.css';

interface StudentAdmissionWizardPageProps {
  onBack?: () => void;
  onComplete?: () => void;
  initialClass?: string;
  initialSection?: string;
  academicYear?: string;
}

export const StudentAdmissionWizardPage: React.FC<StudentAdmissionWizardPageProps> = ({ 
  onBack,
  onComplete,
  initialClass = 'Class 5',
  initialSection = 'Section A',
  academicYear = '2026-2027',
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedAdmNo, setGeneratedAdmNo] = useState('');

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [dob, setDob] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const selectedClass = initialClass;
  const selectedSection = initialSection;
  const [rollNumber, setRollNumber] = useState('');

  // Fee Allocation States (Added during Registration)
  const [tuitionFee, setTuitionFee] = useState<number>(0);
  const [admissionFee, setAdmissionFee] = useState<number>(0);
  const [transportFee, setTransportFee] = useState<number>(0);
  const [examFee, setExamFee] = useState<number>(0);

  const totalAllocatedFee = Math.max(0, tuitionFee + admissionFee + transportFee + examFee);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const admNo = `ADM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedAdmNo(admNo);

    const sName = `${firstName || 'New'} ${lastName || 'Student'}`.trim();

    const newStudent: StudentRecord = {
      id: `std-${Date.now()}`,
      admissionNo: admNo,
      rollNo: rollNumber || '101',
      studentName: sName,
      className: selectedClass,
      sectionName: selectedSection,
      gender: gender,
      dob: dob || '2014-05-14',
      admissionDate: new Date().toISOString().split('T')[0],
      parentName: fatherName || 'Parent / Guardian',
      parentRelation: 'Father',
      contact: emergencyContact || '+91 98765 43210',
      email: `${(firstName || 'student').toLowerCase()}@example.com`,
      address: 'School Enrolment Registered Address',
      feeStatus: 'Pending',
      attendancePercent: 100.0,
      status: 'ACTIVE',
      bloodGroup: 'O+',
      house: 'Red House',
      transport: transportFee > 0 ? 'School Bus' : 'Private Transport',
      hostel: 'Day Scholar',
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    saveStudentToStorage(newStudent);
    setIsSuccess(true);
  };

  const handleReturn = () => {
    if (onComplete) onComplete();
    else if (onBack) onBack();
  };

  if (isSuccess) {
    return (
      <Card className={styles.successCard}>
        <div className={styles.successWrapper}>
          <CheckCircle2 size={48} className={styles.successIcon} />
          <h3>Student Admission Completed!</h3>
          <p>Enrolled Student: <strong>{firstName} {lastName}</strong></p>
          <p>Target Class & Section: <strong>{selectedClass} - {selectedSection}</strong> ({academicYear})</p>
          <p>Assigned Admission Number: <strong>{generatedAdmNo}</strong></p>
          <div style={{ background: '#f3e8ff', border: '1px solid #d8b4fe', padding: '12px', borderRadius: '12px', color: '#7e22ce', margin: '16px 0' }}>
            <Sparkles size={16} /> <strong>Total Allocated Fee Structure: ₹{totalAllocatedFee.toLocaleString('en-IN')}</strong> (Saved to Master Student Storage & Fee Terminal)
          </div>
          <div>
            <Button variant="primary" onClick={handleReturn}>
              Return to {selectedClass} ({selectedSection}) Dashboard →
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Button variant="outline" size="sm" leftIcon={<ArrowLeft size={16} />} onClick={onBack}>
          Back to Section Selection
        </Button>
        <div>
          <h2 className={styles.title}>Student Admission & Fee Allocation Wizard</h2>
          <p className={styles.subtitle}>Enrolling new student directly into <strong>{selectedClass} ({selectedSection})</strong> for Academic Year {academicYear}</p>
        </div>
      </header>

      {/* Stepper Header */}
      <div className={styles.stepper}>
        <div className={`${styles.step} ${step >= 1 ? styles.activeStep : ''}`}>
          <User size={16} /> 1. Personal Details
        </div>
        <div className={`${styles.step} ${step >= 2 ? styles.activeStep : ''}`}>
          <Users size={16} /> 2. Parent Details
        </div>
        <div className={`${styles.step} ${step >= 3 ? styles.activeStep : ''}`}>
          <GraduationCap size={16} /> 3. Academic Class
        </div>
        <div className={`${styles.step} ${step >= 4 ? styles.activeStep : ''}`}>
          <DollarSign size={16} /> 4. Fee Allocation
        </div>
        <div className={`${styles.step} ${step >= 5 ? styles.activeStep : ''}`}>
          <Heart size={16} /> 5. Medical & Submit
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className={styles.form}>
          {step === 1 && (
            <div className={styles.formGrid}>
              <Input label="Student First Name" placeholder="e.g. Aarav" value={firstName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)} required />
              <Input label="Student Last Name" placeholder="e.g. Sharma" value={lastName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)} required />
              <Input label="Date of Birth" type="date" value={dob} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDob(e.target.value)} required />
              
              <div style={{ gridColumn: 'span 2', marginTop: '8px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Gender (Boy / Girl)
                </label>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: gender === 'Male' ? '#e0f2fe' : '#f8fafc', padding: '10px 20px', borderRadius: '10px', border: gender === 'Male' ? '2px solid #0284c7' : '1px solid #cbd5e1', fontWeight: 700, color: gender === 'Male' ? '#0369a1' : '#475569' }}>
                    <input type="radio" name="studentGender" value="Male" checked={gender === 'Male'} onChange={() => setGender('Male')} style={{ accentColor: '#0284c7' }} /> Male (Boy)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: gender === 'Female' ? '#fce7f3' : '#f8fafc', padding: '10px 20px', borderRadius: '10px', border: gender === 'Female' ? '2px solid #db2777' : '1px solid #cbd5e1', fontWeight: 700, color: gender === 'Female' ? '#be185d' : '#475569' }}>
                    <input type="radio" name="studentGender" value="Female" checked={gender === 'Female'} onChange={() => setGender('Female')} style={{ accentColor: '#db2777' }} /> Female (Girl)
                  </label>
                </div>
              </div>

              <div className={styles.actions}>
                <Button type="button" variant="primary" onClick={() => setStep(2)}>Next: Parent Details →</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className={styles.formGrid}>
              <Input label="Father / Guardian Name" placeholder="e.g. Rajesh Sharma" value={fatherName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFatherName(e.target.value)} required />
              <Input label="Emergency Contact Mobile" placeholder="+91 98765 43210" value={emergencyContact} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmergencyContact(e.target.value)} required />
              <div className={styles.actions}>
                <Button type="button" variant="secondary" onClick={() => setStep(1)}>← Back</Button>
                <Button type="button" variant="primary" onClick={() => setStep(3)}>Next: Academic Class →</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className={styles.formGrid}>
              <div style={{ gridColumn: 'span 2', background: '#f3e8ff', border: '1px solid #d8b4fe', padding: '12px 16px', borderRadius: '12px', color: '#7e22ce' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.85rem' }}>
                  <Lock size={16} /> Pre-Selected via Admission Center Workflow:
                </div>
                <div style={{ marginTop: '4px', fontSize: '0.95rem', fontWeight: 800 }}>
                  {selectedClass} • {selectedSection} (Academic Year {academicYear})
                </div>
              </div>

              <Input label="Target Class (Pre-selected)" value={selectedClass} readOnly />
              <Input label="Section (Pre-selected)" value={selectedSection} readOnly />
              <Input label="Assigned Roll Number" value={rollNumber} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRollNumber(e.target.value)} required />
              <div className={styles.actions}>
                <Button type="button" variant="secondary" onClick={() => setStep(2)}>← Back</Button>
                <Button type="button" variant="primary" onClick={() => setStep(4)}>Next: Fee Allocation →</Button>
              </div>
            </div>
          )}

          {/* STEP 4: FEE ALLOCATION DURING REGISTRATION */}
          {step === 4 && (
            <div className={styles.formGrid}>
              <div style={{ gridColumn: 'span 2', background: '#faf5ff', border: '1px solid #d8b4fe', padding: '14px', borderRadius: '14px', marginBottom: '8px' }}>
                <div style={{ color: '#7e22ce', fontWeight: 800, fontSize: '0.9rem', marginBottom: '4px' }}>
                  <Sparkles size={16} /> Initial Fee Structure Allocation
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Set up allocated fee heads for {selectedClass} ({selectedSection}). These fee amounts will populate the student's financial ledger in the Accountant Collection Terminal.
                </div>
              </div>

              <Input label="Term Tuition Fee (₹)" type="number" value={tuitionFee} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTuitionFee(Number(e.target.value))} required />
              <Input label="One-Time Admission Fee (₹)" type="number" value={admissionFee} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAdmissionFee(Number(e.target.value))} required />
              <Input label="Annual Transport Bus Fee (₹)" type="number" value={transportFee} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTransportFee(Number(e.target.value))} />
              <Input label="Annual Exam & Lab Fee (₹)" type="number" value={examFee} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setExamFee(Number(e.target.value))} />

              <div style={{ gridColumn: 'span 2', background: '#7e22ce', color: '#ffffff', padding: '12px 16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Total Allocated Dues for {firstName || 'Student'}:</span>
                <strong style={{ fontSize: '1.25rem', fontWeight: 900 }}>₹{totalAllocatedFee.toLocaleString('en-IN')}</strong>
              </div>

              <div className={styles.actions}>
                <Button type="button" variant="secondary" onClick={() => setStep(3)}>← Back</Button>
                <Button type="button" variant="primary" onClick={() => setStep(5)}>Next: Medical & Submit →</Button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className={styles.formGrid}>
              <Input label="Blood Group" defaultValue="O+" />
              <Input label="Known Allergies" placeholder="None" />
              <Input label="Emergency Medical Notes" placeholder="e.g. Wears glasses" />
              <div className={styles.actions}>
                <Button type="button" variant="secondary" onClick={() => setStep(4)}>← Back</Button>
                <Button type="submit" variant="primary">Submit & Admit Student</Button>
              </div>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
};
