import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, Sparkles, Cpu, Layers } from 'lucide-react';
import styles from './SuperAdminLoginPage.module.css';

interface SuperAdminLoginPageProps {
  onLoginSuccess: () => void;
}

export const SuperAdminLoginPage: React.FC<SuperAdminLoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('superadmin@bestschool.saas');
  const [password, setPassword] = useState('••••••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess();
  };

  return (
    <div className={styles.container}>
      {/* 3D Animated Floating Elements */}
      <div className={styles.cubeBackground}>
        <div className={styles.floatingCube1}>
          <div className={styles.cubeFace}></div>
        </div>
        <div className={styles.floatingCube2}></div>
        <div className={styles.floatingOrb}></div>
        <div className={styles.gridOverlay}></div>
      </div>

      <div className={styles.loginWrapper}>
        {/* Left Side 3D Visual Card */}
        <div className={styles.visualCard}>
          <div className={styles.visualBadge}>
            <Sparkles size={16} /> Enterprise SaaS 3D Cloud
          </div>
          <h1 className={styles.visualTitle}>Super Admin Control Hub</h1>
          <p className={styles.visualText}>Software Owner Platform Engine for Multi-Tenant School Provisioning, Subscriptions & Telemetry.</p>
          
          <div className={styles.featureGrid}>
            <div className={styles.featurePill}>
              <Layers size={14} /> Multi-Tenant Isolation
            </div>
            <div className={styles.featurePill}>
              <Cpu size={14} /> Hardened JWT Session
            </div>
          </div>
        </div>

        {/* Right Side Glassmorphism Login Form */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.logoBadge}><Shield size={24} /></div>
            <h2 className={styles.title}>Software Owner Login</h2>
            <p className={styles.subtitle}>Enter master credentials to access Super Admin Portal</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Super Admin Email</label>
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
              <label className={styles.label}>Master Password</label>
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
              <span>Authenticate & Enter Control Center</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div className={styles.footerNote}>
            <Sparkles size={14} />
            <span>Protected by Enterprise Security Policies</span>
          </div>
        </div>
      </div>
    </div>
  );
};
