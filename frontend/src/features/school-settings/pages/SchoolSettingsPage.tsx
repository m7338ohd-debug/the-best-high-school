import React, { useState } from 'react';
import { Card } from '../../../shared/components/ui/Card/Card';
import { Button } from '../../../shared/components/ui/Button/Button';
import { Input } from '../../../shared/components/ui/Input/Input';
import { useSchoolSettings } from '../../../shared/context/SchoolContext';
import { 
  School, 
  Calendar, 
  IndianRupee, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  Upload, 
  Trash2, 
  Plus, 
  Award, 
  BookOpen, 
  GraduationCap, 
  Sparkles,
  Lock
} from 'lucide-react';
import styles from './SchoolSettingsPage.module.css';

export const SchoolSettingsPage: React.FC = () => {
  const {
    profile,
    updateProfile,
    uploadLogo,
    removeLogo,
    academicYears,
    addAcademicYear,
    setActiveAcademicYear,
    deleteAcademicYear,
    financialRules,
    updateFinancialRules,
    feeRules,
    updateFeeRules,
    paymentModes,
    updatePaymentModes,
  } = useSchoolSettings();

  const [activeTab, setActiveTab] = useState<'profile' | 'academic' | 'finance' | 'payments' | 'fee'>('profile');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Local state for profile form
  const [schoolName, setSchoolName] = useState(profile.schoolName);
  const [principalName, setPrincipalName] = useState(profile.principalName);
  const [board, setBoard] = useState(profile.board);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [address, setAddress] = useState(profile.address);
  const [tagline, setTagline] = useState(profile.tagline);
  const [affiliationNo, setAffiliationNo] = useState(profile.affiliationNo);

  // Local state for Academic Year Creation Form
  const [newYearName, setNewYearName] = useState('2027-2028');
  const [newStartDate, setNewStartDate] = useState('2027-04-01');
  const [newEndDate, setNewEndDate] = useState('2028-03-31');
  const [setNewAsActive, setSetNewAsActive] = useState(false);

  // Local state for Financial Rules
  const [receiptPrefix, setReceiptPrefix] = useState(financialRules.receiptPrefix);
  const [gstPercentage, setGstPercentage] = useState(financialRules.gstPercentage);
  const [fiscalYearStart, setFiscalYearStart] = useState(financialRules.fiscalYearStartMonth);
  const [upiId, setUpiId] = useState(financialRules.upiId || 'stjude@icici');
  const [bankAccountDetails, setBankAccountDetails] = useState(financialRules.bankAccountDetails || '');

  // Local state for Fee Rules
  const [gracePeriodDays, setGracePeriodDays] = useState(feeRules.gracePeriodDays);
  const [lateFineAmount, setLateFineAmount] = useState(feeRules.lateFineAmount);
  const [maxFineCap, setMaxFineCap] = useState(feeRules.maxFineCap);
  const [autoReminders, setAutoReminders] = useState(feeRules.autoRemindersEnabled);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Image File Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit. Please choose a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        uploadLogo(result);
        showToast('School logo image uploaded and updated across school portal & login page!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Preset Logo Selection
  const setPresetLogo = (presetType: string) => {
    let svgDataUrl = '';
    if (presetType === 'shield') {
      svgDataUrl = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="%237e22ce" stroke="%23ffffff" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="11" r="3" fill="%23ffffff"/></svg>`;
    } else if (presetType === 'grad') {
      svgDataUrl = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="%232563eb" stroke="%23ffffff" stroke-width="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`;
    } else if (presetType === 'book') {
      svgDataUrl = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="%23059669" stroke="%23ffffff" stroke-width="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`;
    }
    uploadLogo(svgDataUrl);
    showToast('Preset school logo badge applied!');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      schoolName,
      principalName,
      board,
      email,
      phone,
      address,
      tagline,
      affiliationNo,
    });
    showToast('School profile details saved successfully!');
  };

  const handleCreateAcademicYear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newYearName.trim()) return;

    addAcademicYear(
      {
        yearName: newYearName,
        startDate: newStartDate,
        endDate: newEndDate,
      },
      setNewAsActive
    );

    showToast(`New Academic Year ${newYearName} created & saved!`);
    setNewYearName('');
  };

  const handleSaveFinancialRules = (e: React.FormEvent) => {
    e.preventDefault();
    updateFinancialRules({
      receiptPrefix,
      gstPercentage: Number(gstPercentage),
      fiscalYearStartMonth: fiscalYearStart,
      upiId,
      bankAccountDetails,
    });
    showToast('Financial rules & receipt configuration saved!');
  };

  const handleSaveFeeRules = (e: React.FormEvent) => {
    e.preventDefault();
    updateFeeRules({
      gracePeriodDays: Number(gracePeriodDays),
      lateFineAmount: Number(lateFineAmount),
      maxFineCap: Number(maxFineCap),
      autoRemindersEnabled: autoReminders,
    });
    showToast('Fee parameters & overdue fine rules saved in Indian Rupees (₹)!');
  };

  const togglePaymentMode = (id: string) => {
    const updated = paymentModes.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m));
    updatePaymentModes(updated);
    showToast('Payment mode channel preferences updated!');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>School Master Foundation Settings</h2>
          <p className={styles.subtitle}>Configure school profile, image logo, academic calendar, and financial rules in Indian Rupees (₹)</p>
        </div>
        {toastMessage && (
          <div className={styles.toast}>
            <CheckCircle2 size={16} /> {toastMessage}
          </div>
        )}
      </header>

      {/* Tabs Navigation */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'profile' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <School size={16} /> Profile & Logo
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'academic' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('academic')}
        >
          <Calendar size={16} /> Academic Years
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'finance' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('finance')}
        >
          <IndianRupee size={16} /> Financial Rules (₹)
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'payments' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('payments')}
        >
          <CreditCard size={16} /> Payment Modes
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'fee' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('fee')}
        >
          <ShieldCheck size={16} /> Fee & Fine Rules (₹)
        </button>
      </div>

      {/* Tab Contents */}
      <div className={styles.content}>
        {/* TAB 1: SCHOOL PROFILE & LOGO UPLOAD */}
        {activeTab === 'profile' && (
          <Card title="School Profile & Emblem Configuration">
            <form onSubmit={handleSaveProfile} className={styles.formGrid}>
              {/* LOGO UPLOAD & PREVIEW SECTION */}
              <div className={styles.logoSection}>
                <div className={styles.logoSectionTitle}>
                  <Sparkles size={16} style={{ color: '#7e22ce' }} />
                  <span>School Crest / Official Logo Upload</span>
                </div>
                <div className={styles.logoUploadRow}>
                  <div className={styles.logoPreviewBox}>
                    {profile.logoUrl ? (
                      <img src={profile.logoUrl} alt="School Logo" className={styles.previewImage} />
                    ) : (
                      <div className={styles.logoFallback}>
                        <School size={32} />
                        <span>No Logo</span>
                      </div>
                    )}
                  </div>

                  <div className={styles.uploadActions}>
                    <label className={styles.fileInputLabel}>
                      <Upload size={16} /> Upload New Logo Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className={styles.hiddenFileInput}
                      />
                    </label>
                    <span className={styles.uploadHelp}>
                      Upload PNG, JPG, or SVG image (Max 5MB). Logo appears on portal header, receipts & login page.
                    </span>

                    {profile.logoUrl && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          removeLogo();
                          showToast('Logo image removed.');
                        }}
                      >
                        <Trash2 size={14} /> Remove Image
                      </Button>
                    )}

                    <div>
                      <div className={styles.presetTitle}>Or Choose Preset Emblem Badge:</div>
                      <div className={styles.presetLogos}>
                        <button
                          type="button"
                          className={styles.presetBtn}
                          onClick={() => setPresetLogo('shield')}
                          title="Royal Shield Emblem"
                        >
                          <Award size={20} color="#7e22ce" />
                        </button>
                        <button
                          type="button"
                          className={styles.presetBtn}
                          onClick={() => setPresetLogo('grad')}
                          title="Graduation Academy Crest"
                        >
                          <GraduationCap size={20} color="#2563eb" />
                        </button>
                        <button
                          type="button"
                          className={styles.presetBtn}
                          onClick={() => setPresetLogo('book')}
                          title="Open Knowledge Crest"
                        >
                          <BookOpen size={20} color="#059669" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FORM FIELDS */}
              <Input
                label="School / Academy Name"
                value={schoolName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSchoolName(e.target.value)}
                required
              />
              <Input
                label="Tagline / Motto"
                value={tagline}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTagline(e.target.value)}
              />
              <Input
                label="Principal / Director Name"
                value={principalName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrincipalName(e.target.value)}
              />
              <Input
                label="Education Board / Affiliation"
                value={board}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBoard(e.target.value)}
              />
              <Input
                label="Affiliation Number"
                value={affiliationNo}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAffiliationNo(e.target.value)}
              />
              <Input
                label="Official Email Address"
                value={email}
                type="email"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Phone Number"
                value={phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
              />
              <Input
                label="Campus Physical Address"
                value={address}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}
              />

              <div className={styles.actions}>
                <Button type="submit" variant="primary">
                  Save School Profile & Logo
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* TAB 2: ACADEMIC YEAR CREATION & MANAGEMENT */}
        {activeTab === 'academic' && (
          <div className={styles.academicSection}>
            <Card title="Existing Academic Years & Active Term">
              <div className={styles.academicList}>
                {academicYears.map((ay) => (
                  <div
                    key={ay.id}
                    className={`${styles.academicCard} ${ay.isCurrent ? styles.activeYear : ''}`}
                  >
                    <div>
                      <h4 className={styles.yearTitle}>
                        {ay.yearName} {ay.isCurrent && '(Active Academic Term)'}
                      </h4>
                      <span className={styles.yearSub}>
                        <Calendar size={13} /> {ay.startDate} – {ay.endDate}
                      </span>
                    </div>

                    <div className={styles.yearActions}>
                      {ay.isCurrent ? (
                        <span className={styles.badgeActive}>ACTIVE</span>
                      ) : ay.status === 'UPCOMING' ? (
                        <span className={styles.badgeUpcoming}>UPCOMING</span>
                      ) : (
                        <span className={styles.badgePast}>PAST</span>
                      )}

                      {!ay.isCurrent && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setActiveAcademicYear(ay.id);
                            showToast(`Academic Year ${ay.yearName} set as Active!`);
                          }}
                        >
                          Set Active
                        </Button>
                      )}

                      {academicYears.length > 1 && !ay.isCurrent && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            deleteAcademicYear(ay.id);
                            showToast(`Academic Year ${ay.yearName} deleted.`);
                          }}
                        >
                          <Trash2 size={14} color="#dc2626" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* CREATE NEW ACADEMIC YEAR CARD FORM */}
            <div className={styles.createAcademicCard}>
              <div className={styles.createAcademicTitle}>
                <Plus size={18} style={{ color: '#7e22ce' }} />
                <span>Create New Academic Year</span>
              </div>
              <form onSubmit={handleCreateAcademicYear} className={styles.formGrid}>
                <Input
                  label="Academic Year Name (e.g. 2027-2028)"
                  value={newYearName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewYearName(e.target.value)}
                  placeholder="2027-2028"
                  required
                />
                <Input
                  label="Start Date"
                  type="date"
                  value={newStartDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewStartDate(e.target.value)}
                  required
                />
                <Input
                  label="End Date"
                  type="date"
                  value={newEndDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewEndDate(e.target.value)}
                  required
                />

                <div className={styles.fullWidth} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  <input
                    type="checkbox"
                    id="setActiveNow"
                    checked={setNewAsActive}
                    onChange={(e) => setSetNewAsActive(e.target.checked)}
                    className={styles.toggleCheckbox}
                  />
                  <label htmlFor="setActiveNow" style={{ fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    Set this as the Active Academic Year immediately
                  </label>
                </div>

                <div className={styles.actions}>
                  <Button type="submit" variant="primary">
                    <Plus size={16} /> Create Academic Year
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: FINANCIAL RULES (INDIAN RUPEES ₹ ENFORCED) */}
        {activeTab === 'finance' && (
          <Card title="Financial Rules & Receipt Configuration">
            <form onSubmit={handleSaveFinancialRules} className={styles.formGrid}>
              <div className={styles.currencyLockNotice}>
                <Lock size={16} />
                <span>Financial Currency Enforced in <strong>Indian Rupees (₹ - INR)</strong> across all modules & receipts.</span>
              </div>

              <Input label="Currency" value="INR (₹) - Indian Rupee" disabled helperText="System Currency Standard" />
              <Input
                label="Receipt Number Prefix"
                value={receiptPrefix}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReceiptPrefix(e.target.value)}
              />
              <Input
                label="Receipt Sequence Format"
                value="{PREFIX}-{YEAR}-{SEQUENCE}"
                disabled
                helperText="Auto-incremented receipt generator"
              />
              <Input
                label="Financial Year Cycle Start"
                value={fiscalYearStart}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFiscalYearStart(e.target.value)}
              />
              <Input
                label="School UPI ID (For Digital Receipts)"
                value={upiId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpiId(e.target.value)}
              />
              <Input
                label="GST / Tax Surcharge (%)"
                type="number"
                value={gstPercentage}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGstPercentage(Number(e.target.value))}
              />
              <Input
                label="Bank Account Details (For Receipts)"
                value={bankAccountDetails}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBankAccountDetails(e.target.value)}
              />

              <div className={styles.actions}>
                <Button type="submit" variant="primary">
                  Save Financial Rules (₹)
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* TAB 4: PAYMENT MODES */}
        {activeTab === 'payments' && (
          <Card title="Configurable Payment Channels">
            <div className={styles.paymentList}>
              {paymentModes.map((mode) => (
                <div key={mode.id} className={styles.paymentRow}>
                  <div className={styles.paymentLabel}>
                    <CreditCard size={18} style={{ color: '#7e22ce' }} />
                    <div>
                      <div>{mode.name}</div>
                      {mode.details && <span style={{ fontSize: 11, color: '#64748b' }}>{mode.details}</span>}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={mode.enabled}
                    onChange={() => togglePaymentMode(mode.id)}
                    className={styles.toggleCheckbox}
                  />
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* TAB 5: FEE & FINE RULES IN INDIAN RUPEES (₹) */}
        {activeTab === 'fee' && (
          <Card title="School Fee Parameters & Overdue Fine Rules (Indian Rupees ₹)">
            <form onSubmit={handleSaveFeeRules} className={styles.formGrid}>
              <Input
                label="Grace Period (Days)"
                type="number"
                value={gracePeriodDays}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGracePeriodDays(Number(e.target.value))}
              />
              <Input
                label="Late Fine Amount (₹)"
                type="number"
                value={lateFineAmount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLateFineAmount(Number(e.target.value))}
                helperText="Applied when payment crosses grace period"
              />
              <Input
                label="Maximum Fine Cap (₹)"
                type="number"
                value={maxFineCap}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaxFineCap(Number(e.target.value))}
                helperText="Maximum late fee surcharge ceiling"
              />

              <div className={styles.fullWidth} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
                <input
                  type="checkbox"
                  id="autoRemind"
                  checked={autoReminders}
                  onChange={(e) => setAutoReminders(e.target.checked)}
                  className={styles.toggleCheckbox}
                />
                <label htmlFor="autoRemind" style={{ fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  Automatically send SMS/WhatsApp overdue fee reminders to parents
                </label>
              </div>

              <div className={styles.actions}>
                <Button type="submit" variant="primary">
                  Save Fee & Fine Rules (₹)
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
};
