import { CorsOptions } from 'cors';

export const corsConfig: CorsOptions = {
  origin: true, // Allow all origins dynamically for development & testing
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-tenant-id', 'x-requested-with'],
};
