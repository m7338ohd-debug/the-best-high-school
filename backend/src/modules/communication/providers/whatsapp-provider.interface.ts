export interface WhatsappSendOptions {
  recipientPhone: string;
  templateName: string;
  parameters: Record<string, string>;
}

export interface WhatsappSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface WhatsappProviderInterface {
  sendWhatsapp(options: WhatsappSendOptions): Promise<WhatsappSendResult>;
}
