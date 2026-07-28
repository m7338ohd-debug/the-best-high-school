export type DeliveryChannel = 
  | 'SMS' 
  | 'EMAIL' 
  | 'WHATSAPP' 
  | 'SMS_EMAIL' 
  | 'SMS_WHATSAPP' 
  | 'EMAIL_WHATSAPP' 
  | 'ALL';

export type QueueStatus = 'QUEUED' | 'PROCESSING' | 'DELIVERED' | 'FAILED' | 'RETRYING' | 'COMPLETED';

export interface RecipientContainer {
  id: string;
  name: string;
  category: 'GRADE_RANGE' | 'GENERAL' | 'FINANCE' | 'CLASS' | 'SPECIAL';
  description: string;
  totalStudents: number;
  totalParents: number;
  totalMobiles: number;
  totalEmails: number;
  whatsappEnabled: number;
}

export interface CommunicationAuditLog {
  id: string;
  messageSnippet: string;
  subject?: string;
  channel: DeliveryChannel;
  recipientGroupName: string;
  sender: string;
  recipientsCount: number;
  successful: number;
  failed: number;
  timestamp: string;
  status: QueueStatus;
  retryCount: number;
}

export interface ParentContactRecord {
  id: string;
  studentName: string;
  admissionNo: string;
  className: string;
  sectionName: string;
  parentName: string;
  fatherMobile: string;
  motherMobile?: string;
  guardianMobile?: string;
  parentEmail: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ALUMNI';
  whatsappEnabled: boolean;
}
