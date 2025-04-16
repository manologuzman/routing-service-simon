import { Injectable } from '@nestjs/common';
import { RedisService } from './cache/redis.service';
import { Route } from '../domain/entities/route.entity';

@Injectable()
export class RoutingRedisRepository {
  private readonly ROUTE_TTL = 300; // segundos
  private readonly LOCK_TTL = 5; // segundos

  constructor(private readonly redisService: RedisService) {}

  async set(key: string, value: any, ttl: number): Promise<void> {
    await this.redisService.set(key, JSON.stringify(value), ttl);
  }

  private getCacheKey(deviceId: string): string {
    return `route:${deviceId}`;
  }

  private getLockKey(deviceId: string): string {
    return `lock:route:${deviceId}`;
  }

  async acquireLock(key: string): Promise<boolean> {
    const result = await this.redisService.setIfNotExists(
      key,
      'locked',
      this.LOCK_TTL,
    );
    return result;
  }

  async releaseLock(key: string): Promise<void> {
    await this.redisService.del(key);
  }

  async get(deviceId: string): Promise<Route | null> {
    const key = this.getCacheKey(deviceId);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = await this.redisService.get(key);

    if (!data) {
      return null;
    }

    const parsedData = JSON.parse(data) as Route;
    return parsedData;
  }

  async saveRoute(route: Route): Promise<void> {
    const key = this.getCacheKey(route.deviceId);
    try {
      await this.redisService.set(key, JSON.stringify(route), this.ROUTE_TTL);
    } catch (error: unknown) {
      let errorMessage = 'An error occurred';

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.error(errorMessage);
      throw new Error('Failed to execute the method');
    }
  }
}
