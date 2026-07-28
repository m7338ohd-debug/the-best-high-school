import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { appConfig } from './config/app.config.js';
import { corsConfig } from './config/cors.config.js';
import { tenantMiddleware } from './middlewares/tenant.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { ApiResponse } from './shared/responses/api.response.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { schoolProfileRoutes } from './modules/school-profile/school-profile.routes.js';
import { academicYearRoutes } from './modules/academic-year/academic-year.routes.js';
import { brandingRoutes } from './modules/branding/branding.routes.js';
import { financialSettingsRoutes } from './modules/financial-settings/financial-settings.routes.js';
import { paymentModeRoutes } from './modules/payment-modes/payment-mode.routes.js';
import { feeSettingsRoutes } from './modules/fee-settings/fee-settings.routes.js';
import { classRoutes } from './modules/classes/class.routes.js';
import { sectionRoutes } from './modules/sections/section.routes.js';
import { academicTermRoutes } from './modules/academic-terms/academic-term.routes.js';
import { feeCategoryRoutes } from './modules/fee-categories/fee-category.routes.js';
import { studentRoutes } from './modules/students/student.routes.js';
import { financeRoutes } from './modules/finance/finance.routes.js';
import { communicationRoutes } from './modules/communication/communication.routes.js';
import { systemRoutes } from './modules/system/system.routes.js';
import { HealthMonitoringService } from './shared/health/health-monitoring.service.js';

export const createApp = (): Express => {
  const app = express();

  // Security Middlewares - Production Protection
  app.use(helmet());
  app.use(cors(corsConfig));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Tenant Resolution Middleware
  app.use(tenantMiddleware);

  // Enhanced Health check endpoint
  app.get('/health', async (_req: Request, res: Response) => {
    const report = await HealthMonitoringService.getHealthReport();
    return ApiResponse.ok(res, 'System Health Status', report);
  });

  app.get(`${appConfig.apiPrefix}/health`, async (_req: Request, res: Response) => {
    const report = await HealthMonitoringService.getHealthReport();
    return ApiResponse.ok(res, 'API v1 Subsystem Status', report);
  });

  // Business & SaaS Infrastructure Modules Routing
  app.use(`${appConfig.apiPrefix}/auth`, authRoutes);
  app.use(`${appConfig.apiPrefix}/school-profile`, schoolProfileRoutes);
  app.use(`${appConfig.apiPrefix}/academic-years`, academicYearRoutes);
  app.use(`${appConfig.apiPrefix}/branding`, brandingRoutes);
  app.use(`${appConfig.apiPrefix}/financial-settings`, financialSettingsRoutes);
  app.use(`${appConfig.apiPrefix}/payment-modes`, paymentModeRoutes);
  app.use(`${appConfig.apiPrefix}/fee-settings`, feeSettingsRoutes);
  app.use(`${appConfig.apiPrefix}/classes`, classRoutes);
  app.use(`${appConfig.apiPrefix}/sections`, sectionRoutes);
  app.use(`${appConfig.apiPrefix}/academic-terms`, academicTermRoutes);
  app.use(`${appConfig.apiPrefix}/fee-categories`, feeCategoryRoutes);
  app.use(`${appConfig.apiPrefix}/students`, studentRoutes);
  app.use(`${appConfig.apiPrefix}/finance`, financeRoutes);
  app.use(`${appConfig.apiPrefix}/communication`, communicationRoutes);
  app.use(`${appConfig.apiPrefix}/system`, systemRoutes);

  // Global Error Handler
  app.use(errorMiddleware);

  return app;
};
