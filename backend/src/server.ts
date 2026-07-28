import { createApp } from './app.js';
import { appConfig } from './config/app.config.js';
import { connectDB } from './database/sequelize.js';
import { LoggerService } from './shared/logger/logger.service.js';
import { SchedulerService } from './cron/scheduler.service.js';

const startServer = async (): Promise<void> => {
  await connectDB();
  SchedulerService.init();

  const app = createApp();

  app.listen(appConfig.port, () => {
    LoggerService.info(`Server running on port ${appConfig.port} in ${appConfig.env} mode.`);
    LoggerService.info(`API Base Endpoint: http://localhost:${appConfig.port}${appConfig.apiPrefix}`);
  });
};

startServer().catch((error) => {
  LoggerService.error('Failed to start server:', error);
  process.exit(1);
});
