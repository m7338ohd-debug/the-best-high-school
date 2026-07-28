import { z } from 'zod';

export const createAcademicYearSchema = z.object({
  yearName: z.string().min(4, 'Year name is required'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be YYYY-MM-DD'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be YYYY-MM-DD'),
  makeActive: z.boolean().optional(),
});
