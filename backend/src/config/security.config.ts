import { env } from './environment.js';

export const securityConfig = {
  bcryptSaltRounds: 12,
  rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
  rateLimitMaxRequests: 300,
} as const;

export const mailConfig = {
  provider: env.MAIL_PROVIDER,
  brevoApiKey: env.BREVO_API_KEY,
  resendApiKey: env.RESEND_API_KEY,
  fromAddress: env.MAIL_FROM_ADDRESS,
  fromName: env.MAIL_FROM_NAME,
} as const;

export const cloudinaryConfig = {
  cloudName: env.CLOUDINARY_CLOUD_NAME,
  apiKey: env.CLOUDINARY_API_KEY,
  apiSecret: env.CLOUDINARY_API_SECRET,
} as const;

export const storageConfig = {
  provider: env.STORAGE_PROVIDER,
  cloudinary: cloudinaryConfig,
} as const;

export const queueConfig = {
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: parseInt(process.env.REDIS_PORT || '6379', 10),
} as const;
