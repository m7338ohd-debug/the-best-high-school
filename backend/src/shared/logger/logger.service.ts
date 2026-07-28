import pino from 'pino';
import { env } from '../../config/environment.js';

/**
 * Enterprise Pino Logger instance supporting info, warn, error, debug, and audit log levels.
 */
export const logger = pino({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: env.NODE_ENV !== 'production' ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  } : undefined,
});

export class LoggerService {
  public static info(message: string, meta?: Record<string, unknown>): void {
    logger.info(meta || {}, message);
  }

  public static warn(message: string, meta?: Record<string, unknown>): void {
    logger.warn(meta || {}, message);
  }

  public static error(message: string, error?: Error | unknown, meta?: Record<string, unknown>): void {
    const errObj = error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : { rawError: error };
    logger.error({ ...meta, err: errObj }, message);
  }

  public static debug(message: string, meta?: Record<string, unknown>): void {
    logger.debug(meta || {}, message);
  }

  public static audit(action: string, actorId: string, tenantId: string, details?: Record<string, unknown>): void {
    logger.info({ type: 'AUDIT_LOG', action, actorId, tenantId, details, timestamp: new Date().toISOString() }, `[AUDIT] ${action}`);
  }
}
