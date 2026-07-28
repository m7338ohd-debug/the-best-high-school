export interface UpdateSystemConfigDTO {
  schoolName?: string;
  receiptPrefix?: string;
  currencySymbol?: string;
  timezone?: string;
  businessHours?: string;
  backupSchedule?: string;
}

export interface CreateBackupDTO {
  backupType?: 'MANUAL' | 'AUTOMATED';
}

export interface RestoreBackupDTO {
  backupId: string;
}
