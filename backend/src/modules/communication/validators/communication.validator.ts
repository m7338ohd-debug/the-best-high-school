import { z } from 'zod';

export const sendSmsSchema = z.object({
  recipientPhone: z.string().min(10, 'Valid phone number required'),
  message: z.string().min(1, 'Message text is required'),
  templateId: z.string().uuid().optional(),
});

export const sendEmailSchema = z.object({
  recipientEmail: z.string().email('Valid email address required'),
  subject: z.string().min(1, 'Subject is required'),
  bodyHtml: z.string().min(1, 'Body HTML content is required'),
  attachmentUrl: z.string().optional(),
});

export const createTemplateSchema = z.object({
  templateName: z.string().min(1, 'Template name is required'),
  channel: z.enum(['SMS', 'EMAIL', 'WHATSAPP']),
  subject: z.string().optional(),
  bodyContent: z.string().min(1, 'Body content is required'),
  variables: z.array(z.string()).optional(),
});
