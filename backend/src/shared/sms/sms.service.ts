import { LoggerService } from '../logger/logger.service.js';

export interface ISMSOptions {
  phone: string;
  message: string;
  templateId?: string;
}

export interface ISMSProvider {
  sendSMS(options: ISMSOptions): Promise<boolean>;
}

export class MSG91SMSProvider implements ISMSProvider {
  async sendSMS(options: ISMSOptions): Promise<boolean> {
    LoggerService.info(`[MSG91SMSProvider] Sending SMS to ${options.phone}: ${options.message}`);
    return true;
  }
}

export class SMSService {
  private provider: ISMSProvider;

  constructor(provider?: ISMSProvider) {
    this.provider = provider || new MSG91SMSProvider();
  }

  public setProvider(provider: ISMSProvider): void {
    this.provider = provider;
  }

  public async send(options: ISMSOptions): Promise<boolean> {
    return this.provider.sendSMS(options);
  }
}
