import { z } from 'zod';

export const registerSchoolSchema = z.object({
  schoolName: z.string().min(2, 'School name must be at least 2 characters'),
  schoolCode: z.string().min(2, 'School code must be at least 2 characters').toUpperCase(),
  schoolEmail: z.string().email('Invalid school email address'),
  adminFirstName: z.string().min(1, 'First name is required'),
  adminLastName: z.string().min(1, 'Last name is required'),
  adminEmail: z.string().email('Invalid admin email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
