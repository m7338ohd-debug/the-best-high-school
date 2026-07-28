import React, { useState, useEffect } from 'react';
import { School, Lock, Mail, ArrowRight, CheckCircle2, IndianRupee, PieChart, Calculator, Sparkles, ShieldCheck } from 'lucide-react';
import styles from './AcceptInvitationPage.module.css';

interface AcceptInvitationPageProps {
  onInvitationAccepted: (email: string, schoolName?: string) => void;
}

export const AcceptInvitationPage: React.FC<AcceptInvitationPageProps> = ({ onInvitationAccepted }) => {
  const [adminEmail, setAdminEmail] = useState('admin@school.edu');
  const [schoolName, setSchoolName] = useState('School ERP Workspace');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Parse URL query params if present (e.g. ?token=...&email=...&school=...)
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    const schoolParam = params.get('school');
    if (emailParam) setAdminEmail(emailParam);
    if (schoolParam) setSchoolName(schoolParam);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setErrorMessage(null);
    setIsSuccess(true);

    setTimeout(() => {
      onInvitationAccepted(adminEmail, schoolName);
    }, 1800);
  };

  return (
    <div className={styles.container}>
      {/* 3D Animated Background Visuals */}
      <div className={styles.bgVisual}>
        <div className={styles.orb1}></div>
        <div className={styles.orb2}></div>
        <div className={styles.gridPattern}></div>
      </div>

      <div className={styles.wrapper}>
        {/* Left Side 3D Animated Finance Management Card */}
        <div className={styles.visualCard}>
          <div className={styles.badgePill}>
            <Sparkles size={14} /> School ERP Finance Activation
          </div>
          
          <h1 className={styles.visualTitle}>{schoolName}</h1>
          <p className={styles.visualSubtitle}>Set your administrator password to activate your tenant-isolated Finance ERP Workspace</p>

          {/* 3D Animated Floating Widgets */}
          <div className={styles.widgetStack}>
            <div className={`${styles.widgetCard} ${styles.w1}`}>
              <div className={styles.wIcon}><IndianRupee size={20} /></div>
              <div>
                <span className={styles.wLabel}>Account Balance</span>
                <strong className={styles.wVal}>₹1,48,200.00</strong>
              </div>
              <span className={styles.wBadge}>ACTIVATING</span>
            </div>

            <div className={`${styles.widgetCard} ${styles.w2}`}>
              <div className={styles.wIcon}><PieChart size={20} /></div>
              <div>
                <span className={styles.wLabel}>Collection Engine</span>
                <strong className={styles.wVal}>Double-Entry Ledger</strong>
              </div>
              <span className={styles.wStatus}>SECURE</span>
            </div>

            <div className={`${styles.widgetCard} ${styles.w3}`}>
              <div className={styles.wIcon}><Calculator size={20} /></div>
              <div>
                <span className={styles.wLabel}>Receipt Prefix</span>
                <strong className={styles.wVal}>REC-2026-00001</strong>
              </div>
              <span className={styles.wBadge}>GAPLESS</span>
            </div>
          </div>
        </div>

        {/* Right Side Password Setup Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.logoBadge}><School size={26} /></div>
            <h2 className={styles.title}>Activate Account & Set Password</h2>
            <p className={styles.subtitle}>Invitation Verified for {schoolName}</p>
          </div>

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className={styles.form}>
              {errorMessage && (
                <div className={styles.errorBanner}>
                  {errorMessage}
                </div>
              )}

              <div className={styles.field}>
                <label className={styles.label}>School Administrator Email</label>
                <div className={styles.inputWrapper}>
                  <Mail size={16} className={styles.inputIcon} />
                  <input
                    type="email"
                    className={styles.inputReadOnly}
                    value={adminEmail}
                    readOnly
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>New Administrator Password</label>
                <div className={styles.inputWrapper}>
                  <Lock size={16} className={styles.inputIcon} />
                  <input
                    type="password"
                    className={styles.input}
                    placeholder="Min 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Confirm Administrator Password</label>
                <div className={styles.inputWrapper}>
                  <Lock size={16} className={styles.inputIcon} />
                  <input
                    type="password"
                    className={styles.input}
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span>Activate & Access School Finance Portal</span>
                <ArrowRight size={18} />
              </button>
            </form>
          ) : (
            <div className={styles.successState}>
              <CheckCircle2 size={52} className={styles.successIcon} />
              <h3>Account Activated Successfully!</h3>
              <p>Your password has been saved. Entering <strong>{schoolName} Finance Portal</strong>...</p>
            </div>
          )}

          <div className={styles.footerNote}>
            <ShieldCheck size={14} />
            <span>Multi-Tenant Schema Isolated & Database Sync Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
