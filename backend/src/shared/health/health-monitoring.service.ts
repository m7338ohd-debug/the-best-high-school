import { sequelize } from '../../database/sequelize.js';
import { appConfig } from '../../config/app.config.js';
import { ModuleRegistryService } from '../modules/module-registry.service.js';

export interface SystemHealthReport {
  status: 'UP' | 'DEGRADED' | 'DOWN';
  timestamp: string;
  uptimeSeconds: number;
  environment: string;
  version: string;
  memoryUsage: {
    rssMb: number;
    heapTotalMb: number;
    heapUsedMb: number;
  };
  subsystems: {
    database: { status: 'UP' | 'DOWN'; responseTimeMs: number };
    storageProvider: { status: 'UP'; provider: string };
    mailProvider: { status: 'UP'; provider: string };
    smsProvider: { status: 'UP'; provider: string };
    cacheProvider: { status: 'UP'; provider: string };
    queueProvider: { status: 'UP'; provider: string };
  };
  modules: Record<string, string>;
}

export class HealthMonitoringService {
  public static async getHealthReport(): Promise<SystemHealthReport> {
    const startTime = Date.now();
    let dbStatus: 'UP' | 'DOWN' = 'UP';
    let dbResponseTime = 0;

    try {
      await sequelize.authenticate();
      dbResponseTime = Date.now() - startTime;
    } catch (_error) {
      dbStatus = 'DOWN';
    }

    const memory = process.memoryUsage();

    return {
      status: dbStatus === 'UP' ? 'UP' : 'DEGRADED',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: appConfig.env,
      version: '1.0.0',
      memoryUsage: {
        rssMb: Math.round(memory.rss / (1024 * 1024)),
        heapTotalMb: Math.round(memory.heapTotal / (1024 * 1024)),
        heapUsedMb: Math.round(memory.heapUsed / (1024 * 1024)),
      },
      subsystems: {
        database: { status: dbStatus, responseTimeMs: dbResponseTime },
        storageProvider: { status: 'UP', provider: 'CloudinaryAdapter' },
        mailProvider: { status: 'UP', provider: 'BrevoProvider' },
        smsProvider: { status: 'UP', provider: 'MSG91Provider' },
        cacheProvider: { status: 'UP', provider: 'MemoryCacheProvider' },
        queueProvider: { status: 'UP', provider: 'InternalQueue' },
      },
      modules: ModuleRegistryService.getHealthReport(),
    };
  }
}
