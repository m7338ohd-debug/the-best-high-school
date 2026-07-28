import { BaseService } from '../../shared/services/base.service.js';
import { CommunicationQueueModel } from './models/communication-queue.model.js';
import { CommunicationRepository } from './communication.repository.js';
import { SendSmsDTO, SendEmailDTO, CreateTemplateDTO } from './dto/communication.dto.js';
import { sendSmsSchema, sendEmailSchema, createTemplateSchema } from './validators/communication.validator.js';
import { SmsLogModel } from './models/sms-log.model.js';
import { EmailLogModel } from './models/email-log.model.js';
import { NotificationTemplateModel } from './models/notification-template.model.js';
import { AuditActions } from '../../shared/constants/global.constants.js';

export class CommunicationService extends BaseService<CommunicationQueueModel, CommunicationRepository> {
  constructor(repository?: CommunicationRepository) {
    super(repository || new CommunicationRepository());
  }

  public parseVariables(template: string, data: Record<string, string>): string {
    let result = template;
    for (const [key, value] of Object.entries(data)) {
      const placeholder = new RegExp(`{{\\s*${key}\\s*}}`, 'gi');
      result = result.replace(placeholder, value || '');
    }
    return result;
  }

  async enqueueSms(dto: SendSmsDTO) {
    const tenantId = this.ensureTenant();
    const validated = this.validate(sendSmsSchema, dto);

    const queueItem = await this.repository.create({
      channel: 'SMS',
      recipient: validated.recipientPhone,
      body: validated.message,
      status: 'PENDING',
      priority: 1,
      retryCount: 0,
      maxRetries: 3,
    });

    // Instant mock queue worker execution
    await SmsLogModel.create({
      tenantId,
      recipientPhone: validated.recipientPhone,
      messageText: validated.message,
      providerName: 'Fast2SMS',
      status: 'SENT',
    });

    await queueItem.update({ status: 'SENT' });
    this.publishAudit(AuditActions.SETTINGS_UPDATED, 'CommunicationQueue', queueItem.id, { channel: 'SMS', recipient: validated.recipientPhone });

    return queueItem;
  }

  async enqueueEmail(dto: SendEmailDTO) {
    const tenantId = this.ensureTenant();
    const validated = this.validate(sendEmailSchema, dto);

    const queueItem = await this.repository.create({
      channel: 'EMAIL',
      recipient: validated.recipientEmail,
      subject: validated.subject,
      body: validated.bodyHtml,
      attachmentUrl: validated.attachmentUrl,
      status: 'PENDING',
      priority: 2,
      retryCount: 0,
      maxRetries: 3,
    });

    await EmailLogModel.create({
      tenantId,
      recipientEmail: validated.recipientEmail,
      subject: validated.subject,
      bodyHtml: validated.bodyHtml,
      attachmentUrl: validated.attachmentUrl,
      providerName: 'Brevo',
      status: 'SENT',
    });

    await queueItem.update({ status: 'SENT' });
    this.publishAudit(AuditActions.SETTINGS_UPDATED, 'CommunicationQueue', queueItem.id, { channel: 'EMAIL', recipient: validated.recipientEmail });

    return queueItem;
  }

  async getTemplates() {
    const tenantId = this.ensureTenant();
    let templates = await NotificationTemplateModel.findAll({ where: { tenantId } });

    if (templates.length === 0) {
      templates = await NotificationTemplateModel.bulkCreate([
        {
          tenantId,
          templateName: 'Payment Receipt Notification',
          channel: 'SMS',
          bodyContent: 'Dear Parent, fee payment of ${{Amount}} for {{StudentName}} has been received. Receipt #: {{ReceiptNumber}}.',
          variables: ['StudentName', 'Amount', 'ReceiptNumber'],
          isActive: true,
        },
        {
          tenantId,
          templateName: 'Monthly Fee Due Reminder',
          channel: 'EMAIL',
          subject: 'Fee Due Notice for {{StudentName}} - {{SchoolName}}',
          bodyContent: '<p>Dear {{ParentName}},</p><p>Monthly tuition fee of <strong>${{Amount}}</strong> for <strong>{{StudentName}}</strong> (Class {{Class}}) is due on <strong>{{DueDate}}</strong>.</p>',
          variables: ['ParentName', 'StudentName', 'Class', 'Amount', 'DueDate', 'SchoolName'],
          isActive: true,
        },
      ]);
    }

    return templates;
  }

  async createTemplate(dto: CreateTemplateDTO) {
    const tenantId = this.ensureTenant();
    const validated = this.validate(createTemplateSchema, dto);

    const template = await NotificationTemplateModel.create({
      tenantId,
      templateName: validated.templateName,
      channel: validated.channel,
      subject: validated.subject,
      bodyContent: validated.bodyContent,
      variables: validated.variables || [],
      isActive: true,
    });

    this.publishAudit(AuditActions.SETTINGS_UPDATED, 'NotificationTemplate', template.id, { templateName: template.templateName });
    return template;
  }

  async getDeliveryMetrics() {
    this.ensureTenant();
    return this.repository.getDeliveryMetrics();
  }
}
