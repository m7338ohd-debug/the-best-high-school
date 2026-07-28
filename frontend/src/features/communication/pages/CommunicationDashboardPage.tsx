import React, { useState } from 'react';
import { RecipientContainersGrid } from '../components/RecipientContainersGrid';
import { BulkCommunicationComposer } from '../components/BulkCommunicationComposer';
import { SendConfirmationModal } from '../components/SendConfirmationModal';
import { LiveQueueProgressCard } from '../components/LiveQueueProgressCard';
import { CommunicationAuditLogsTable } from '../components/CommunicationAuditLogsTable';

import { mockRecipientContainers, mockAuditLogs } from '../data/communicationMockData';
import { RecipientContainer, DeliveryChannel, CommunicationAuditLog } from '../types/communication.types';
import styles from './CommunicationDashboardPage.module.css';

export const CommunicationDashboardPage: React.FC = () => {
  const [containers] = useState<RecipientContainer[]>(mockRecipientContainers);
  const [selectedContainer, setSelectedContainer] = useState<RecipientContainer>(mockRecipientContainers[0]);
  const [auditLogs, setAuditLogs] = useState<CommunicationAuditLog[]>(mockAuditLogs);

  // Active Broadcast Workflow States
  const [pendingConfirmation, setPendingConfirmation] = useState<{
    container: RecipientContainer;
    channel: DeliveryChannel;
    subject: string;
    message: string;
  } | null>(null);

  const [activeQueue, setActiveQueue] = useState<{
    container: RecipientContainer;
    channel: DeliveryChannel;
    totalRecipients: number;
    subject: string;
    message: string;
  } | null>(null);

  // Trigger Confirmation Modal
  const handleOpenConfirmation = (data: {
    container: RecipientContainer;
    channel: DeliveryChannel;
    subject: string;
    message: string;
  }) => {
    setPendingConfirmation(data);
  };

  // Confirm Send & Launch Live Queue Engine
  const handleConfirmSendNow = () => {
    if (!pendingConfirmation) return;

    const { container, channel, subject, message } = pendingConfirmation;
    const isSms = channel.includes('SMS') || channel === 'ALL';
    const isEmail = channel.includes('EMAIL') || channel === 'ALL';
    const isWa = channel.includes('WHATSAPP') || channel === 'ALL';

    const totalRecipients = 
      (isSms ? container.totalMobiles : 0) +
      (isEmail ? container.totalEmails : 0) +
      (isWa ? container.whatsappEnabled : 0);

    setActiveQueue({
      container,
      channel,
      totalRecipients,
      subject,
      message,
    });

    setPendingConfirmation(null);
  };

  // Queue Processing Completed -> Append to Audit Log
  const handleQueueCompleted = () => {
    if (!activeQueue) return;

    const newLog: CommunicationAuditLog = {
      id: `log-${Date.now()}`,
      messageSnippet: activeQueue.message,
      subject: activeQueue.subject,
      channel: activeQueue.channel,
      recipientGroupName: activeQueue.container.name,
      sender: 'Senior Administrator (ERP Communication Hub)',
      recipientsCount: activeQueue.totalRecipients,
      successful: activeQueue.totalRecipients,
      failed: 0,
      timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
      status: 'COMPLETED',
      retryCount: 0,
    };

    setAuditLogs((prev) => [newLog, ...prev]);
    setActiveQueue(null);
  };

  // Retry Failed Messages
  const handleRetryFailed = (logId: string) => {
    setAuditLogs((prev) =>
      prev.map((log) =>
        log.id === logId
          ? { ...log, successful: log.recipientsCount, failed: 0, status: 'COMPLETED', retryCount: log.retryCount + 1 }
          : log
      )
    );
  };

  return (
    <div className={styles.container}>
      {/* PAGE HEADER */}
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>Parent Communication Center (Bulk Hub)</h2>
          <p className={styles.subtitle}>
            Broadcast SMS, Email & WhatsApp messages to thousands of parents using smart directory recipient containers
          </p>
        </div>
      </header>

      {/* 1. RECIPIENT CONTAINERS GRID (CONTAINER 1: LKG-5, CONTAINER 2: 6-10 & SMART GROUPS) */}
      <RecipientContainersGrid
        containers={containers}
        selectedContainerId={selectedContainer.id}
        onSelectContainer={(container) => setSelectedContainer(container)}
      />

      {/* LIVE QUEUE PROGRESS ENGINE (SHOWN DURING QUEUE PROCESSING) */}
      {activeQueue && (
        <LiveQueueProgressCard
          container={activeQueue.container}
          channel={activeQueue.channel}
          totalRecipients={activeQueue.totalRecipients}
          onCompleteQueue={handleQueueCompleted}
        />
      )}

      {/* 2. BULK COMMUNICATION COMPOSE WORKSPACE */}
      <BulkCommunicationComposer
        containers={containers}
        selectedContainer={selectedContainer}
        onSelectContainer={(container) => setSelectedContainer(container)}
        onOpenConfirmation={handleOpenConfirmation}
      />

      {/* 3. COMMUNICATION AUDIT HISTORY LOGS TABLE */}
      <CommunicationAuditLogsTable
        logs={auditLogs}
        onRetryFailed={handleRetryFailed}
      />

      {/* SEND CONFIRMATION DIALOG MODAL */}
      {pendingConfirmation && (
        <SendConfirmationModal
          container={pendingConfirmation.container}
          channel={pendingConfirmation.channel}
          subject={pendingConfirmation.subject}
          message={pendingConfirmation.message}
          onClose={() => setPendingConfirmation(null)}
          onConfirmSend={handleConfirmSendNow}
        />
      )}
    </div>
  );
};
