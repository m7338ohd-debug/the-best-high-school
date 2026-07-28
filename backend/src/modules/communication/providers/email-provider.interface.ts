export interface EmailSendOptions {
  recipientEmail: string;
  subject: string;
  bodyHtml: string;
  attachmentUrl?: string;
}

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface EmailProviderInterface {
  sendEmail(options: EmailSendOptions): Promise<EmailSendResult>;
}
