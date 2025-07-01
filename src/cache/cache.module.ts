import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheService } from './cache.service';

@Module({
  imports: [
    NestCacheModule.register({
      isGlobal: true, // se quiser usar em todos os módulos automaticamente
    }),
  ],
  providers: [CacheService],
  exports: [CacheService], // se quiser usar em outros módulos
})
export class CacheModule {}
