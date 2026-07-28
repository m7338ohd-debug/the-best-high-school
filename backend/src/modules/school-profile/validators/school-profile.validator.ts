import { z } from 'zod';

export const updateSchoolProfileSchema = z.object({
  schoolName: z.string().min(2, 'School name must be at least 2 characters').optional(),
  registrationNumber: z.string().optional(),
  affiliationNumber: z.string().optional(),
  board: z.string().optional(),
  schoolType: z.string().optional(),
  establishedYear: z.number().int().min(1800).max(2100).optional(),
  principalName: z.string().optional(),
  contactPerson: z.string().optional(),
  phone: z.string().optional(),
  alternatePhone: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});
