import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getCache<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
    const cached: T | undefined = await this.cacheManager.get<T>(key);

    if (cached) return cached;

    const value = await fetchFn();
    await this.cacheManager.set(key, value, 60); // TTL de 60s
    return value;
  }
}