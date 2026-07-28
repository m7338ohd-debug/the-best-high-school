import { LoggerService } from '../logger/logger.service.js';

export interface IMailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface IMailProvider {
  sendMail(options: IMailOptions): Promise<boolean>;
}

export class BrevoMailProvider implements IMailProvider {
  async sendMail(options: IMailOptions): Promise<boolean> {
    LoggerService.info(`[BrevoMailProvider] Sending email to ${options.to} - Subject: ${options.subject}`);
    return true;
  }
}

export class ResendMailProvider implements IMailProvider {
  async sendMail(options: IMailOptions): Promise<boolean> {
    LoggerService.info(`[ResendMailProvider] Sending email to ${options.to} - Subject: ${options.subject}`);
    return true;
  }
}

export class MailService {
  private provider: IMailProvider;

  constructor(provider?: IMailProvider) {
    this.provider = provider || new BrevoMailProvider();
  }

  public setProvider(provider: IMailProvider): void {
    this.provider = provider;
  }

  public async send(options: IMailOptions): Promise<boolean> {
    return this.provider.sendMail(options);
  }
}
