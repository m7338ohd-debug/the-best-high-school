export interface SendSmsDTO {
  recipientPhone: string;
  message: string;
  templateId?: string;
}

export interface SendEmailDTO {
  recipientEmail: string;
  subject: string;
  bodyHtml: string;
  attachmentUrl?: string;
}

export interface CreateTemplateDTO {
  templateName: string;
  channel: 'SMS' | 'EMAIL' | 'WHATSAPP';
  subject?: string;
  bodyContent: string;
  variables?: string[];
}
