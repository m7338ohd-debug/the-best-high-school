import { LoggerService } from '../shared/logger/logger.service.js';

export class QueueService {
  public static async addEmailJob(data: Record<string, unknown>): Promise<void> {
    LoggerService.info('[EmailQueue] Added email job to queue', data);
  }

  public static async addSmsJob(data: Record<string, unknown>): Promise<void> {
    LoggerService.info('[SMSQueue] Added SMS job to queue', data);
  }

  public static async addNotificationJob(data: Record<string, unknown>): Promise<void> {
    LoggerService.info('[NotificationQueue] Added notification job to queue', data);
  }

  public static async addReceiptJob(data: Record<string, unknown>): Promise<void> {
    LoggerService.info('[ReceiptQueue] Added receipt PDF job to queue', data);
  }
}
