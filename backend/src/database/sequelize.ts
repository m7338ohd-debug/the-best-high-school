import { Sequelize } from 'sequelize';
import { databaseConfig } from '../config/database.config.js';
import { LoggerService } from '../shared/logger/logger.service.js';

const databaseUrl = process.env.DATABASE_URL || databaseConfig.host === undefined ? process.env.DATABASE_URL : undefined;

export const sequelize = databaseUrl
  ? new Sequelize(databaseUrl, databaseConfig)
  : new Sequelize(databaseConfig);

export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    LoggerService.info('✓ Database Connected');

    // Synchronize all database tables safely
    await sequelize.sync();
    LoggerService.info('✓ Sequelize Synced');
  } catch (error) {
    LoggerService.error('Unable to connect or sync PostgreSQL database:', error);
    process.exit(1);
  }
};
