import { z } from 'zod';

export const updateSystemConfigSchema = z.object({
  schoolName: z.string().optional(),
  receiptPrefix: z.string().optional(),
  currencySymbol: z.string().optional(),
  timezone: z.string().optional(),
  businessHours: z.string().optional(),
  backupSchedule: z.string().optional(),
});

export const restoreBackupSchema = z.object({
  backupId: z.string().uuid('Valid backup ID required'),
});
