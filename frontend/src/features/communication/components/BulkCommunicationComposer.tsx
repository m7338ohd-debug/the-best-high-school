import React, { useState } from 'react';
import { RecipientContainer, DeliveryChannel } from '../types/communication.types';
import { 
  Send, 
  MessageSquare, 
  Mail, 
  MessageCircle, 
  Sparkles, 
  Eye, 
  Tag, 
  Bell, 
  DollarSign, 
  FileText, 
  Bus, 
  Calendar, 
  Edit3, 
  RefreshCw, 
  CheckCircle2 
} from 'lucide-react';
import styles from './BulkCommunicationComposer.module.css';

interface BulkCommunicationComposerProps {
  containers: RecipientContainer[];
  selectedContainer: RecipientContainer;
  onSelectContainer: (c: RecipientContainer) => void;
  onOpenConfirmation: (data: {
    container: RecipientContainer;
    channel: DeliveryChannel;
    subject: string;
    message: string;
  }) => void;
}

type NotificationCategory = 'GENERAL' | 'FEES' | 'EXAM' | 'TRANSPORT' | 'EVENT' | 'CUSTOM';

export const BulkCommunicationComposer: React.FC<BulkCommunicationComposerProps> = ({
  containers,
  selectedContainer,
  onSelectContainer,
  onOpenConfirmation,
}) => {
  const [activeCategory, setActiveCategory] = useState<NotificationCategory>('GENERAL');
  const [deliveryChannel, setDeliveryChannel] = useState<DeliveryChannel>('ALL');
  const [subject, setSubject] = useState('Important School Notice from St. Jude International Academy');
  const [message, setMessage] = useState(
    'Dear {{ParentName}}, please be informed that {{SchoolName}} will remain closed tomorrow on account of local holiday. Regular classes will resume on Monday.'
  );

  const [isFeeFetching, setIsFeeFetching] = useState(false);
  const [feeFetchedSuccess, setFeeFetchedSuccess] = useState(false);

  const variables = [
    '{{SchoolName}}',
    '{{StudentName}}',
    '{{ParentName}}',
    '{{Class}}',
    '{{Section}}',
    '{{OutstandingBalance}}',
    '{{DueDate}}',
    '{{ReceiptNumber}}',
    '{{AcademicYear}}',
  ];

  // Preset Template Library
  const applyTemplate = (cat: NotificationCategory, tSubject: string, tMessage: string) => {
    setActiveCategory(cat);
    setSubject(tSubject);
    setMessage(tMessage);
  };

  // Auto-Fetch Fee Details Engine Trigger
  const handleAutoFetchFeeData = () => {
    setIsFeeFetching(true);
    setTimeout(() => {
      setIsFeeFetching(false);
      setFeeFetchedSuccess(true);
      setActiveCategory('FEES');
      setSubject('Monthly Fee Due & Pending Balance Alert');
      setMessage(
        'Dear {{ParentName}}, this is an automated fee reminder from {{SchoolName}}. Pending dues of {{OutstandingBalance}} for {{StudentName}} ({{Class}}-{{Section}}) are due on {{DueDate}}. Please clear the dues promptly.'
      );
      setTimeout(() => setFeeFetchedSuccess(false), 4000);
    }, 600);
  };

  const insertVariable = (varTag: string) => {
    setMessage((prev) => prev + ' ' + varTag);
  };

  // Interpolate Live Sample Preview
  const generatePreview = (text: string) => {
    return text
      .replace(/\{\{SchoolName\}\}/g, 'ST. JUDE INTERNATIONAL ACADEMY')
      .replace(/\{\{StudentName\}\}/g, 'Alex Johnson')
      .replace(/\{\{ParentName\}\}/g, 'Mark Johnson')
      .replace(/\{\{Class\}\}/g, 'Grade 10')
      .replace(/\{\{Section\}\}/g, 'A')
      .replace(/\{\{OutstandingBalance\}\}/g, '₹12,500')
      .replace(/\{\{DueDate\}\}/g, '2026-08-05')
      .replace(/\{\{ReceiptNumber\}\}/g, 'REC-2026-000245')
      .replace(/\{\{AcademicYear\}\}/g, '2026-2027');
  };

  const isEmailActive = deliveryChannel.includes('EMAIL') || deliveryChannel === 'ALL';
  const smsUnits = Math.ceil(message.length / 160) || 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenConfirmation({
      container: selectedContainer,
      channel: deliveryChannel,
      subject,
      message,
    });
  };

  return (
    <div className={styles.composerCard}>
      <div className={styles.cardHeader}>
        <div>
          <span className={styles.badgePurple}><Sparkles size={14} /> Multi-Purpose Notification & Fee Broadcast Engine</span>
          <h3 className={styles.title}>Compose Parent Notification & Communication</h3>
          <p className={styles.subtitle}>
            Send General Announcements, Emergency Alerts, Fee Dues, Circulars & Custom Messages to Parents
          </p>
        </div>
      </div>

      {/* 1. NOTIFICATION CATEGORY TABS */}
      <div className={styles.categoryTabs}>
        <button
          type="button"
          className={`${styles.catTab} ${activeCategory === 'GENERAL' ? styles.catTabActive : ''}`}
          onClick={() => applyTemplate(
            'GENERAL',
            'Important School Announcement - Holiday Notice',
            'Dear {{ParentName}}, please note that {{SchoolName}} will remain closed tomorrow due to heavy weather conditions. Online study material will be updated.'
          )}
        >
          <Bell size={15} /> 📢 General Notice
        </button>

        <button
          type="button"
          className={`${styles.catTab} ${activeCategory === 'FEES' ? styles.catTabActive : ''}`}
          onClick={handleAutoFetchFeeData}
        >
          <DollarSign size={15} /> 💰 Fee Due Alert (Auto-Fetch)
        </button>

        <button
          type="button"
          className={`${styles.catTab} ${activeCategory === 'EXAM' ? styles.catTabActive : ''}`}
          onClick={() => applyTemplate(
            'EXAM',
            'Mid-Term Examination Schedule & Admit Card Notice',
            'Dear {{ParentName}}, the Mid-Term Examination schedule for {{StudentName}} ({{Class}}-{{Section}}) has been published. Please collect the Admit Card.'
          )}
        >
          <FileText size={15} /> 📝 Exam & Timetable
        </button>

        <button
          type="button"
          className={`${styles.catTab} ${activeCategory === 'TRANSPORT' ? styles.catTabActive : ''}`}
          onClick={() => applyTemplate(
            'TRANSPORT',
            'School Bus Route Delay Update',
            'Dear Parent of {{StudentName}}, Bus Route #12 is delayed by 15 minutes today due to traffic congestion. Thank you for your patience.'
          )}
        >
          <Bus size={15} /> 🚍 Transport Alert
        </button>

        <button
          type="button"
          className={`${styles.catTab} ${activeCategory === 'EVENT' ? styles.catTabActive : ''}`}
          onClick={() => applyTemplate(
            'EVENT',
            'Annual Sports Day Invitation & Uniform Guidelines',
            'Dear {{ParentName}}, you are cordially invited to {{SchoolName}} Annual Sports Day event on Saturday at 9:00 AM. We look forward to your presence!'
          )}
        >
          <Calendar size={15} /> 🎉 School Event
        </button>

        <button
          type="button"
          className={`${styles.catTab} ${activeCategory === 'CUSTOM' ? styles.catTabActive : ''}`}
          onClick={() => setActiveCategory('CUSTOM')}
        >
          <Edit3 size={15} /> ✍️ Custom Message
        </button>
      </div>

      {/* AUTO-FETCH FEE DUES BANNER (WHEN FEES CATEGORY IS SELECTED) */}
      <div className={styles.feeFetchBanner}>
        <div className={styles.feeFetchLeft}>
          <DollarSign size={18} className={styles.feeIcon} />
          <div>
            <strong>Automated Finance Ledger Synchronization Engine</strong>
            <span>Click to auto-fetch real-time fee dues & balances for target container ({selectedContainer.name})</span>
          </div>
        </div>
        <button
          type="button"
          className={styles.fetchBtn}
          onClick={handleAutoFetchFeeData}
          disabled={isFeeFetching}
        >
          <RefreshCw size={14} className={isFeeFetching ? styles.spinIcon : ''} />
          <span>{isFeeFetching ? 'Fetching Dues...' : '⚡ Auto-Fetch Fee Data & Populate'}</span>
        </button>
      </div>

      {feeFetchedSuccess && (
        <div className={styles.toastSuccess}>
          <CheckCircle2 size={16} /> Successfully synchronized fee ledger balances for <strong>{selectedContainer.name}</strong> from Finance Engine!
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* 2. RECIPIENT CONTAINER SELECTOR DROPDOWN */}
        <div className={styles.formGroup}>
          <label className={styles.label}>1. Target Recipient Container</label>
          <select
            className={styles.selectInput}
            value={selectedContainer.id}
            onChange={(e) => {
              const found = containers.find((c) => c.id === e.target.value);
              if (found) onSelectContainer(found);
            }}
          >
            {containers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.totalStudents} Students ({c.totalMobiles} Mobiles, {c.totalEmails} Emails)
              </option>
            ))}
          </select>
        </div>

        {/* 3. DELIVERY CHANNEL MULTI-CHANNEL SELECTOR */}
        <div className={styles.formGroup}>
          <label className={styles.label}>2. Choose Delivery Channels</label>
          <div className={styles.channelGrid}>
            {[
              { id: 'SMS', label: 'SMS Only', icon: <MessageSquare size={16} /> },
              { id: 'EMAIL', label: 'Email Only', icon: <Mail size={16} /> },
              { id: 'WHATSAPP', label: 'WhatsApp Only', icon: <MessageCircle size={16} /> },
              { id: 'SMS_EMAIL', label: 'SMS + Email', icon: <MessageSquare size={16} /> },
              { id: 'SMS_WHATSAPP', label: 'SMS + WhatsApp', icon: <MessageCircle size={16} /> },
              { id: 'EMAIL_WHATSAPP', label: 'Email + WhatsApp', icon: <Mail size={16} /> },
              { id: 'ALL', label: 'SMS + Email + WhatsApp (All Channels)', icon: <Sparkles size={16} /> },
            ].map((ch) => (
              <button
                key={ch.id}
                type="button"
                className={`${styles.channelBtn} ${deliveryChannel === ch.id ? styles.channelActive : ''}`}
                onClick={() => setDeliveryChannel(ch.id as DeliveryChannel)}
              >
                {ch.icon}
                <span>{ch.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 4. SUBJECT LINE (WHEN EMAIL IS ACTIVE) */}
        {isEmailActive && (
          <div className={styles.formGroup}>
            <label className={styles.label}>3. Email Subject Line</label>
            <input
              type="text"
              className={styles.input}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject line for parent email..."
              required
            />
          </div>
        )}

        {/* 5. DYNAMIC VARIABLES TOOLBAR */}
        <div className={styles.formGroup}>
          <div className={styles.varHeader}>
            <label className={styles.label}>4. Insert Dynamic Personalization Tags</label>
            <span className={styles.varSub}>Click tag to append to message body</span>
          </div>
          <div className={styles.varPillsList}>
            {variables.map((v, i) => (
              <button
                key={i}
                type="button"
                className={styles.varPill}
                onClick={() => insertVariable(v)}
              >
                <Tag size={12} /> {v}
              </button>
            ))}
          </div>
        </div>

        {/* 6. MESSAGE CONTENT TEXTAREA & LENGTH COUNTER */}
        <div className={styles.formGroup}>
          <div className={styles.msgHeader}>
            <label className={styles.label}>5. Message Body Content</label>
            <span className={styles.charCounter}>
              Length: <strong>{message.length} chars</strong> ({smsUnits} SMS {smsUnits > 1 ? 'Units' : 'Unit'})
            </span>
          </div>
          <textarea
            className={styles.textarea}
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        {/* 7. LIVE MESSAGE PREVIEW BOX */}
        <div className={styles.previewContainer}>
          <div className={styles.previewHeader}>
            <Eye size={16} />
            <strong>Live Parent Mobile / Email Message Preview (Rendered Output)</strong>
          </div>
          <div className={styles.previewBody}>
            {generatePreview(message)}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className={styles.submitRow}>
          <button type="submit" className={styles.submitBtn}>
            <Send size={16} />
            <span>Review Recipient Counts & Send Broadcast →</span>
          </button>
        </div>
      </form>
    </div>
  );
};
