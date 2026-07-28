import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

/**
 * Zod schema to validate environment variables at application startup.
 */
const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().transform((val) => parseInt(val, 10)).default('5000'),
  API_PREFIX: z.string().default('/api/v1'),
  
  // Database Configuration
  DATABASE_URL: z.string().optional(),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.string().transform((val) => parseInt(val, 10)).default('5432'),
  DB_NAME: z.string().default('best_school_saas'),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string().default('postgres'),
  DB_LOGGING: z.string().transform((val) => val === 'true').default('false'),

  // JWT Configuration
  JWT_SECRET: z.string().min(16, 'JWT Secret must be at least 16 characters').default('super-secret-jwt-key-best-school-2026'),
  JWT_EXPIRES_IN: z.string().default('1d'),
  JWT_REFRESH_SECRET: z.string().default('super-secret-refresh-key-best-school-2026'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // CORS & Security
  ALLOWED_ORIGINS: z.string().default('http://localhost:3000,http://localhost:5173'),

  // Provider Settings
  MAIL_PROVIDER: z.enum(['brevo', 'resend', 'smtp']).default('brevo'),
  BREVO_API_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  MAIL_FROM_ADDRESS: z.string().email().default('no-reply@bestschool.com'),
  MAIL_FROM_NAME: z.string().default('The Best School Admin'),

  STORAGE_PROVIDER: z.enum(['cloudinary', 's3', 'local']).default('cloudinary'),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  SMS_PROVIDER: z.enum(['msg91', 'twilio', 'textlocal']).default('msg91'),
  MSG91_AUTH_KEY: z.string().optional(),
});

const parseEnv = () => {
  const result = environmentSchema.safeParse(process.env);
  if (!result.success) {
    console.error('Invalid environment variables:', result.error.format());
    throw new Error('Environment configuration validation failed');
  }
  return result.data;
};

export const env = parseEnv();
