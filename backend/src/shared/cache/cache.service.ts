import { LoggerService } from '../logger/logger.service.js';

export interface ICacheProvider {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}

export class MemoryCacheProvider implements ICacheProvider {
  private cache = new Map<string, { value: unknown; expiresAt?: number }>();

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds = 300): Promise<void> {
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;
    this.cache.set(key, { value, expiresAt });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }
}

export class CacheService {
  private provider: ICacheProvider;

  constructor(provider?: ICacheProvider) {
    this.provider = provider || new MemoryCacheProvider();
  }

  public setProvider(provider: ICacheProvider): void {
    this.provider = provider;
    LoggerService.info(`[CacheService] Switched cache provider to ${provider.constructor.name}`);
  }

  public async get<T>(key: string): Promise<T | null> {
    return this.provider.get<T>(key);
  }

  public async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    return this.provider.set(key, value, ttlSeconds);
  }

  public async delete(key: string): Promise<void> {
    return this.provider.delete(key);
  }

  public async clear(): Promise<void> {
    return this.provider.clear();
  }
}

export const cacheService = new CacheService();
