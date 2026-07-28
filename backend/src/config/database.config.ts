import { Options } from 'sequelize';
import { env } from './environment.js';

const isProduction = env.NODE_ENV === 'production' || process.env.NODE_ENV === 'production';
const databaseUrl = process.env.DATABASE_URL || env.DATABASE_URL;

const dialectOptions = (isProduction || databaseUrl?.includes('neon') || databaseUrl?.includes('ssl=true')) ? {
  ssl: {
    require: true,
    rejectUnauthorized: false, // Required for Neon / Managed PostgreSQL
  },
} : {};

export const databaseConfig: Options = databaseUrl
  ? {
      dialect: 'postgres',
      logging: env.DB_LOGGING ? console.log : false,
      pool: {
        max: 20,
        min: 2,
        acquire: 30000,
        idle: 10000,
      },
      dialectOptions,
      define: {
        timestamps: true,
        underscored: true,
        paranoid: true,
      },
    }
  : {
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
      dialectOptions,
      define: {
        timestamps: true,
        underscored: true,
        paranoid: true,
      },
    };
