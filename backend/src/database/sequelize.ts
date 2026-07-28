import { Sequelize } from 'sequelize';
import { databaseConfig } from '../config/database.config.js';
import { LoggerService } from '../shared/logger/logger.service.js';

export const sequelize = new Sequelize(databaseConfig);

export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    LoggerService.info('PostgreSQL database connection established successfully.');

    // Automatically build & synchronize all missing database tables safely
    await sequelize.sync();
    LoggerService.info('All PostgreSQL database tables synchronized successfully.');
  } catch (error) {
    LoggerService.error('Unable to connect or sync PostgreSQL database:', error);
    process.exit(1);
  }
};
