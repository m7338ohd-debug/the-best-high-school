import React, { useState, useEffect } from 'react';
import { School, Lock, Mail, ArrowRight, IndianRupee, PieChart, Calculator, TrendingUp, Sparkles, ShieldCheck } from 'lucide-react';
import { useSchoolSettings } from '../../../shared/context/SchoolContext';
import styles from './SchoolLoginPage.module.css';

interface SchoolLoginPageProps {
  onLoginSuccess: () => void;
}

export const SchoolLoginPage: React.FC<SchoolLoginPageProps> = ({ onLoginSuccess }) => {
  const { profile } = useSchoolSettings();
  const [email, setEmail] = useState(profile.email || 'admin@school.edu');
  const [password, setPassword] = useState('••••••••••••');

  useEffect(() => {
    if (profile.email) {
      setEmail(profile.email);
    }
  }, [profile.email]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess();
  };

  return (
    <div className={styles.container}>
      {/* 3D Animated Background Elements */}
      <div className={styles.bgVisual}>
        <div className={styles.orb1}></div>
        <div className={styles.orb2}></div>
        <div className={styles.gridPattern}></div>
      </div>

      <div className={styles.loginWrapper}>
        {/* Left Side 3D Finance Management Animated Visual Card */}
        <div className={styles.financeVisualCard}>
          <div className={styles.badgePill}>
            <Sparkles size={14} /> School ERP Finance Terminal
          </div>
          
          <h1 className={styles.visualTitle}>{profile.schoolName}</h1>
          <p className={styles.visualSubtitle}>Automated Ledger Closing, Rapid Fee Collection, Receipt Generation & Revenue Forecasting</p>

          {/* 3D Animated Finance Floating Widgets */}
          <div className={styles.widgetStack}>
            <div className={`${styles.widgetCard} ${styles.widget1}`}>
              <div className={styles.widgetIcon}><IndianRupee size={20} /></div>
              <div>
                <span className={styles.widgetLabel}>Daily Cash Closing</span>
                <strong className={styles.widgetVal}>₹14,250.00</strong>
              </div>
              <span className={styles.widgetStatus}>LOCKED</span>
            </div>

            <div className={`${styles.widgetCard} ${styles.widget2}`}>
              <div className={styles.widgetIcon}><PieChart size={20} /></div>
              <div>
                <span className={styles.widgetLabel}>Collection Efficiency</span>
                <strong className={styles.widgetVal}>96.4% Rec. Rate</strong>
              </div>
              <span className={styles.widgetTrend}><TrendingUp size={12} /> +4.2%</span>
            </div>

            <div className={`${styles.widgetCard} ${styles.widget3}`}>
              <div className={styles.widgetIcon}><Calculator size={20} /></div>
              <div>
                <span className={styles.widgetLabel}>Gapless Receipts</span>
                <strong className={styles.widgetVal}>REC-2026-00492</strong>
              </div>
              <span className={styles.widgetBadge}>AUTO-GEN</span>
            </div>
          </div>
        </div>

        {/* Right Side Glassmorphism Login Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.logoBadge}>
              {profile.logoUrl ? (
                <img
                  src={profile.logoUrl}
                  alt={profile.schoolName}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 10 }}
                />
              ) : (
                <School size={24} />
              )}
            </div>
            <h2 className={styles.title}>{profile.schoolName || 'St. Jude School ERP'}</h2>
            <p className={styles.subtitle}>{profile.tagline || 'Staff & Accountant Portal Authentication'}</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>School Email Address</label>
              <div className={styles.inputWrapper}>
                <Mail size={16} className={styles.inputIcon} />
                <input
                  type="email"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <div className={styles.inputWrapper}>
                <Lock size={16} className={styles.inputIcon} />
                <input
                  type="password"
                  className={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span>Sign In to School Workspace</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div className={styles.footerNote}>
            <ShieldCheck size={14} />
            <span>Multi-Tenant Data Isolation Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
};
