import { Module } from '@nestjs/common';
import { RoutingController } from './controllers/routing.controller';
import { CreateRoutingUseCase } from './use-cases/create-routing.usecase';
import { AuditServiceClient } from './infrastructure/clients/audit.client';
import { RoutingRedisRepository } from './infrastructure/redis-routing.repository';
import { RedisService } from './infrastructure/cache/redis.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [RoutingController],
  providers: [
    CreateRoutingUseCase,
    RoutingRedisRepository,
    {
      provide: 'RoutingRedisRepository',
      useClass: RoutingRedisRepository,
    },
    AuditServiceClient,
    RedisService,
  ],
})
export class RoutingModule {}
