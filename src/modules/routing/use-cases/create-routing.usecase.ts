import { Inject, Injectable, Logger } from '@nestjs/common';
import { AuditServiceClient } from '../infrastructure/clients/audit.client';
import { CreateRoutingDto } from '../dto/create-routing.dto';
import { Route } from '../domain/entities/route.entity';
import { Specification } from 'src/core/specification.interface';
import { CreateRoutingSpecification } from '../domain/specifications/create-routing.specification';
import { RoutingRedisRepository } from '../infrastructure/redis-routing.repository';

@Injectable()
export class CreateRoutingUseCase {
  private readonly logger = new Logger(CreateRoutingUseCase.name);
  private readonly TTL_SECONDS = 300;

  constructor(
    @Inject('RoutingRedisRepository')
    private readonly routingRedisRepository: RoutingRedisRepository,
    private readonly auditServiceClient: AuditServiceClient,
  ) {}

  async execute(input: CreateRoutingDto): Promise<Route> {
    const spec: Specification<CreateRoutingDto> =
      new CreateRoutingSpecification();

    if (!spec.isSatisfiedBy(input)) {
      this.logger.warn(`Datos inválidos: ${JSON.stringify(input)}`);
      throw new Error('Parámetros de entrada inválidos');
    }

    const lockKey = `lock:${input.deviceId}`;
    const isLocked = await this.routingRedisRepository.acquireLock(lockKey);

    if (!isLocked) {
      throw new Error(
        `El recurso para el dispositivo ${input.deviceId} está bloqueado`,
      );
    }

    try {
      const cacheKey = `route:${input.deviceId}`;
      const cached = await this.routingRedisRepository.get(cacheKey);
      if (cached) {
        this.logger.log(`Ruta recuperada de cache para ${input.deviceId}`);
        return cached;
      }

      const route = this.calculateMockRoute(input.origin, input.destination);

      const routingEntity: Route = {
        deviceId: input.deviceId,
        origin: input.origin,
        destination: input.destination,
        route,
        status: 'success',
        cacheTTL: this.TTL_SECONDS,
      };

      await this.routingRedisRepository.set(
        cacheKey,
        routingEntity,
        this.TTL_SECONDS,
      );
      await this.auditServiceClient.sendRouteDataToAuditService(routingEntity);

      return routingEntity;
    } catch (error: unknown) {
      let errorMessage = 'Error al calcular ruta';

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      this.logger.error(`${errorMessage}: ${errorMessage}`);
      throw error;
    } finally {
      await this.routingRedisRepository.releaseLock(lockKey);
    }
  }

  private calculateMockRoute(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
  ) {
    // Algoritmo A* simplificado / simulado
    return [
      {
        lat: (origin.lat + destination.lat) / 2,
        lng: (origin.lng + destination.lng) / 2,
      },
      {
        lat: destination.lat,
        lng: destination.lng,
      },
    ];
  }
}
