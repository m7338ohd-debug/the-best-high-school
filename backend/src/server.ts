import { createApp } from './app.js';
import { appConfig } from './config/app.config.js';
import { connectDB } from './database/sequelize.js';
import { LoggerService } from './shared/logger/logger.service.js';
import { SchedulerService } from './cron/scheduler.service.js';
import { env } from './config/environment.js';

const startServer = async (): Promise<void> => {
  LoggerService.info('✓ Environment Loaded');

  await connectDB();

  SchedulerService.init();

  const app = createApp();

  app.listen(appConfig.port, () => {
    LoggerService.info(`✓ Server Listening on port ${appConfig.port} in ${env.NODE_ENV} mode.`);
    LoggerService.info(`API Endpoint: http://localhost:${appConfig.port}${appConfig.apiPrefix}`);
  });
};

startServer().catch((error) => {
  LoggerService.error('Failed to start server:', error);
  process.exit(1);
});
