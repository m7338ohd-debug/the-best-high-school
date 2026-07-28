import { apiClient, ApiResponseWrapper } from '../../../shared/services/api/apiClient';

export interface SystemConfigData {
  schoolName: string;
  receiptPrefix: string;
  currencySymbol: string;
  timezone: string;
  businessHours: string;
  backupSchedule: string;
}

export interface SubscriptionData {
  planName: 'TRIAL' | 'PRO' | 'ENTERPRISE';
  maxStudents: number;
  expiryDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED';
  licenseKey: string;
}

export interface BackupLogData {
  id: string;
  backupName: string;
  fileSizeMb: number;
  backupType: 'MANUAL' | 'AUTOMATED';
  status: 'COMPLETED' | 'FAILED' | 'RESTORING';
  createdAt: string;
}

export class SystemService {
  public static async getConfig(): Promise<SystemConfigData> {
    const res = await apiClient.get<ApiResponseWrapper<SystemConfigData>>('/system/config');
    return res.data.data;
  }

  public static async getSubscription(): Promise<SubscriptionData> {
    const res = await apiClient.get<ApiResponseWrapper<SubscriptionData>>('/system/subscription');
    return res.data.data;
  }

  public static async triggerBackup(): Promise<BackupLogData> {
    const res = await apiClient.post<ApiResponseWrapper<BackupLogData>>('/system/backup', {});
    return res.data.data;
  }

  public static async restoreBackup(backupId: string): Promise<unknown> {
    const res = await apiClient.post<ApiResponseWrapper<unknown>>('/system/restore', { backupId });
    return res.data.data;
  }

  public static async getHealthOverview(): Promise<Record<string, unknown>> {
    const res = await apiClient.get<ApiResponseWrapper<Record<string, unknown>>>('/system/health');
    return res.data.data;
  }

  public static async getBackups(): Promise<BackupLogData[]> {
    const res = await apiClient.get<ApiResponseWrapper<BackupLogData[]>>('/system/backups');
    return res.data.data;
  }
}
