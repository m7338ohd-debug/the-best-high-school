export interface SmsSendOptions {
  recipientPhone: string;
  message: string;
  senderId?: string;
}

export interface SmsSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface SmsProviderInterface {
  sendSms(options: SmsSendOptions): Promise<SmsSendResult>;
}
