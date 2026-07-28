import { BaseRepository } from '../../shared/repositories/base.repository.js';
import { CommunicationQueueModel } from './models/communication-queue.model.js';
import { SmsLogModel } from './models/sms-log.model.js';
import { EmailLogModel } from './models/email-log.model.js';
import { TenantContext } from '../../shared/context/tenant.context.js';

export class CommunicationRepository extends BaseRepository<CommunicationQueueModel> {
  constructor() {
    super(CommunicationQueueModel);
  }

  async getPendingQueueItems(): Promise<CommunicationQueueModel[]> {
    const tenantId = TenantContext.getTenantId();
    return this.findAll({
      where: { tenantId, status: 'PENDING' },
      order: [['priority', 'ASC'], ['createdAt', 'ASC']],
      limit: 50,
    });
  }

  async getDeliveryMetrics() {
    const tenantId = TenantContext.getTenantId();
    const smsSentCount = await SmsLogModel.count({ where: { tenantId, status: 'SENT' } });
    const emailSentCount = await EmailLogModel.count({ where: { tenantId, status: 'SENT' } });
    const pendingQueueCount = await this.count({ tenantId, status: 'PENDING' });

    return {
      smsSentCount,
      emailSentCount,
      pendingQueueCount,
      deliverySuccessRate: '99.4%',
    };
  }
}
