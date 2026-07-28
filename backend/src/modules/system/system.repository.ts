import { BaseRepository } from '../../shared/repositories/base.repository.js';
import { SystemConfigModel } from './models/system-config.model.js';
import { SubscriptionModel } from './models/subscription.model.js';
import { BackupLogModel } from './models/backup-log.model.js';
import { UserSessionModel } from './models/user-session.model.js';
import { TenantContext } from '../../shared/context/tenant.context.js';

export class SystemRepository extends BaseRepository<SystemConfigModel> {
  constructor() {
    super(SystemConfigModel);
  }

  async getOrCreateConfig(): Promise<SystemConfigModel> {
    const tenantId = TenantContext.getTenantId();
    let config = await this.findOne({ where: { tenantId } });
    if (!config) {
      config = await this.create({
        schoolName: 'The Best School',
        receiptPrefix: 'REC-2026-',
        currencySymbol: '$',
        timezone: 'UTC',
        businessHours: '08:00 AM - 04:00 PM',
        backupSchedule: 'Daily at 02:00 AM',
      });
    }
    return config;
  }

  async getOrCreateSubscription(): Promise<SubscriptionModel> {
    const tenantId = TenantContext.getTenantId();
    let sub = await SubscriptionModel.findOne({ where: { tenantId } });
    if (!sub) {
      sub = await SubscriptionModel.create({
        tenantId,
        planName: 'ENTERPRISE',
        maxStudents: 2500,
        expiryDate: '2027-12-31',
        status: 'ACTIVE',
        licenseKey: 'LIC-BESTSCHOOL-2026-ENTERPRISE',
      });
    }
    return sub;
  }

  async getBackupHistory(): Promise<BackupLogModel[]> {
    const tenantId = TenantContext.getTenantId();
    return BackupLogModel.findAll({
      where: { tenantId },
      order: [['createdAt', 'DESC']],
      limit: 20,
    });
  }

  async getActiveUserSessions(): Promise<UserSessionModel[]> {
    const tenantId = TenantContext.getTenantId();
    return UserSessionModel.findAll({
      where: { tenantId, status: 'ACTIVE' },
      order: [['lastActiveAt', 'DESC']],
      limit: 50,
    });
  }
}
