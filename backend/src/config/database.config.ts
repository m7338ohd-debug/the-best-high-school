import { Options } from 'sequelize';
import { env } from './environment.js';

export const databaseConfig: Options = {
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  dialect: 'postgres',
  logging: env.DB_LOGGING ? console.log : false,
  pool: {
    max: 20,
    min: 2,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: env.NODE_ENV === 'production' ? {
    ssl: {
      require: true,
      rejectUnauthorized: false, // For Neon / Cloud PostgreSQL
    },
  } : {},
  define: {
    timestamps: true,
    underscored: true,
    paranoid: true, // soft delete support
  },
};
