import React, { useState, useEffect } from 'react';
import { 
  School, 
  Lock, 
  Mail, 
  ArrowRight, 
  IndianRupee, 
  PieChart, 
  Calculator, 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  Database, 
  Zap, 
  Layers, 
  Eye,
  EyeOff
} from 'lucide-react';
import { useSchoolSettings } from '../../../shared/context/SchoolContext';
import styles from './SchoolLoginPage.module.css';

interface SchoolLoginPageProps {
  onLoginSuccess: () => void;
}

export const SchoolLoginPage: React.FC<SchoolLoginPageProps> = ({ onLoginSuccess }) => {
  const { profile } = useSchoolSettings();
  const [email, setEmail] = useState(profile.email || 'admin@school.edu');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

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
      {/* 3D Ambient Background Visual Orbs */}
      <div className={styles.bgVisual}>
        <div className={styles.orb1}></div>
        <div className={styles.orb2}></div>
        <div className={styles.gridPattern}></div>
      </div>

      {/* TOP HEADER LOGO BRAND BAR */}
      <header className={styles.topBrandHeader}>
        <div className={styles.brandGroup}>
          <div className={styles.brandIconWrapper}>
            {profile.logoUrl ? (
              <img src={profile.logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 8 }} />
            ) : (
              <School size={20} />
            )}
          </div>
          <div>
            <h2 className={styles.brandTitle}>{profile.schoolName || 'The Best Public School'}</h2>
            <span className={styles.brandTag}>School ERP • Multi-Tenant Finance Terminal</span>
          </div>
        </div>
      </header>

      {/* MAIN FULL-PAGE EXECUTIVE HERO & SEPARATE LOGIN CARD WRAPPER */}
      <div className={styles.pageContentGrid}>
        
        {/* LEFT SIDE: FULL 3D ISOMETRIC HERO SHOWCASE */}
        <div className={styles.leftHeroArea}>
          <div className={styles.badgePill}>
            <Sparkles size={14} /> School ERP Finance Terminal
          </div>
          
          <h1 className={styles.heroHeadline}>
            Automate. Collect. Audit. <span className={styles.gradientText}>Everywhere.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Centralize your school fee ledgers, daily cash closings, automated receipt generation, and multi-tenant financial reporting across all campus departments.
          </p>

          {/* 3D ISOMETRIC STAGE & FLOATING METRIC CARDS SIDE-BY-SIDE */}
          <div className={styles.isometricStage}>
            <div className={styles.isometricGlow}></div>
            
            {/* LEFT: 3D ISOMETRIC MODEL GRAPHIC */}
            <div className={styles.isometricGraphicWrapper}>
              <img 
                src="/isometric_school_finance_3d.png" 
                alt="3D Isometric School Finance & Management Model" 
                className={styles.isometricImg}
              />
            </div>

            {/* RIGHT: SEPARATE 3D FLOATING CARDS & STICK CHART COLUMN */}
            <div className={styles.floatingWidgetList}>
              
              {/* 3D DYNAMIC STICK BAR GRAPH STAGE */}
              <div className={styles.stickGraphCard}>
                <div className={styles.stickGraphHeader}>
                  <span>Quarterly Growth Trajectory</span>
                  <span className={styles.badgeLive}>3D LIVE</span>
                </div>
                <div className={styles.stickBarsContainer}>
                  <div className={styles.stickBarGroup}>
                    <div className={`${styles.stickBar} ${styles.bar1}`}></div>
                    <span className={styles.barLabel}>Q1</span>
                  </div>
                  <div className={styles.stickBarGroup}>
                    <div className={`${styles.stickBar} ${styles.bar2}`}></div>
                    <span className={styles.barLabel}>Q2</span>
                  </div>
                  <div className={styles.stickBarGroup}>
                    <div className={`${styles.stickBar} ${styles.bar3}`}></div>
                    <span className={styles.barLabel}>Q3</span>
                  </div>
                  <div className={styles.stickBarGroup}>
                    <div className={`${styles.stickBar} ${styles.bar4}`}></div>
                    <span className={styles.barLabel}>Q4</span>
                  </div>
                </div>
              </div>

              {/* 3 SPACED FLOATING METRIC WIDGETS */}
              <div className={`${styles.widgetCard} ${styles.widget1}`}>
                <div className={styles.widgetIcon}><IndianRupee size={18} /></div>
                <div>
                  <span className={styles.widgetLabel}>Daily Cash Closing</span>
                  <strong className={styles.widgetVal}>₹14,250.00</strong>
                </div>
                <span className={styles.widgetStatus}>LOCKED</span>
              </div>

              <div className={`${styles.widgetCard} ${styles.widget2}`}>
                <div className={styles.widgetIcon}><PieChart size={18} /></div>
                <div>
                  <span className={styles.widgetLabel}>Collection Efficiency</span>
                  <strong className={styles.widgetVal}>96.4% Rec. Rate</strong>
                </div>
                <span className={styles.widgetTrend}><TrendingUp size={12} /> +4.2%</span>
              </div>

              <div className={`${styles.widgetCard} ${styles.widget3}`}>
                <div className={styles.widgetIcon}><Calculator size={18} /></div>
                <div>
                  <span className={styles.widgetLabel}>Gapless Receipts</span>
                  <strong className={styles.widgetVal}>REC-2026-00492</strong>
                </div>
                <span className={styles.widgetBadge}>AUTO-GEN</span>
              </div>
            </div>
          </div>

          {/* BOTTOM FEATURE HIGHLIGHTS BAR */}
          <div className={styles.featureHighlightsRow}>
            <div className={styles.featureItem}>
              <Database size={15} className={styles.featIcon} />
              <div>
                <strong>Centralized Data</strong>
                <span>Single source of truth</span>
              </div>
            </div>

            <div className={styles.featureItem}>
              <Zap size={15} className={styles.featIcon} />
              <div>
                <strong>Workflow Driven</strong>
                <span>Automated ledger closing</span>
              </div>
            </div>

            <div className={styles.featureItem}>
              <Layers size={15} className={styles.featIcon} />
              <div>
                <strong>Multi-Tenant ERP</strong>
                <span>Isolated school databases</span>
              </div>
            </div>

            <div className={styles.featureItem}>
              <ShieldCheck size={15} className={styles.featIcon} />
              <div>
                <strong>Secure & Scalable</strong>
                <span>Bank-grade encryption</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: STANDALONE SEPARATE COMPACT FLOATING LOGIN CARD */}
        <div className={styles.rightCardContainer}>
          <div className={styles.standaloneLoginCard}>
            <div className={styles.cardHeader}>
              <div className={styles.lockBadge}>
                <Lock size={22} />
              </div>
              <h2 className={styles.title}>Welcome Back</h2>
              <p className={styles.subtitle}>Sign in to continue to {profile.schoolName || 'The Best Public School'}</p>
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
                    placeholder="name@school.edu"
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Password</label>
                <div className={styles.inputWrapper}>
                  <Lock size={16} className={styles.inputIcon} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                  />
                  <button 
                    type="button" 
                    className={styles.eyeBtn}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className={styles.optionsRow}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <button type="button" className={styles.forgotLink}>
                  Forgot Password?
                </button>
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
    </div>
  );
};


