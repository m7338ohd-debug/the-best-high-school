import { RecipientContainer, CommunicationAuditLog, ParentContactRecord } from '../types/communication.types';

export const mockRecipientContainers: RecipientContainer[] = [
  {
    id: 'entire-school',
    name: 'Entire School',
    category: 'GENERAL',
    description: 'All Enrolled Students & Parents Across All Grades',
    totalStudents: 0,
    totalParents: 0,
    totalMobiles: 0,
    totalEmails: 0,
    whatsappEnabled: 0,
  },
  {
    id: 'fee-defaulters',
    name: 'Fee Defaulters',
    category: 'FINANCE',
    description: 'Parents with Overdue Pending Fee Dues',
    totalStudents: 0,
    totalParents: 0,
    totalMobiles: 0,
    totalEmails: 0,
    whatsappEnabled: 0,
  },
  {
    id: 'fully-paid',
    name: 'Fully Paid Students',
    category: 'FINANCE',
    description: 'Students with Zero Outstanding Balance',
    totalStudents: 0,
    totalParents: 0,
    totalMobiles: 0,
    totalEmails: 0,
    whatsappEnabled: 0,
  },
];

export const mockAuditLogs: CommunicationAuditLog[] = [];

export const mockParentContacts: ParentContactRecord[] = [];
