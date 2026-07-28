import { apiClient, ApiResponseWrapper } from '../../../shared/services/api/apiClient';

export interface SmsPayload {
  recipientPhone: string;
  message: string;
}

export interface EmailPayload {
  recipientEmail: string;
  subject: string;
  bodyHtml: string;
}

export interface TemplateData {
  id: string;
  templateName: string;
  channel: 'SMS' | 'EMAIL' | 'WHATSAPP';
  bodyContent: string;
}

export class CommunicationService {
  public static async sendSms(payload: SmsPayload): Promise<unknown> {
    const res = await apiClient.post<ApiResponseWrapper<unknown>>('/communication/send-sms', payload);
    return res.data.data;
  }

  public static async sendEmail(payload: EmailPayload): Promise<unknown> {
    const res = await apiClient.post<ApiResponseWrapper<unknown>>('/communication/send-email', payload);
    return res.data.data;
  }

  public static async getTemplates(): Promise<TemplateData[]> {
    const res = await apiClient.get<ApiResponseWrapper<TemplateData[]>>('/communication/templates');
    return res.data.data;
  }

  public static async getMetrics(): Promise<Record<string, unknown>> {
    const res = await apiClient.get<ApiResponseWrapper<Record<string, unknown>>>('/communication/metrics');
    return res.data.data;
  }
}
