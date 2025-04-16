import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redisClient: Redis;

  constructor(private configService: ConfigService) {}

  // Conexión con Redis
  onModuleInit() {
    this.connect();
  }

  // Cerrar conexión con Redis
  async onModuleDestroy() {
    await this.disconnect();
  }

  // Conectar a Redis usando la URL configurada en .env
  private connect() {
    const redisUrl = this.configService.get<string>('REDIS_URL');

    if (!redisUrl) {
      throw new Error('La URL de Redis no está definida en la configuración.');
    }

    this.redisClient = new Redis(redisUrl);

    this.redisClient.on('connect', () => {
      console.log('Conexión exitosa a Redis');
    });

    this.redisClient.on('error', (error) => {
      console.error('Error de conexión con Redis:', error);
    });
  }

  // Desconectar de Redis
  private async disconnect() {
    if (this.redisClient) {
      await this.redisClient.quit();
      console.log('Desconectado de Redis');
    }
  }

  // Método para setear datos de Redis
  async set(key: string, value: string, ttlInSeconds?: number): Promise<void> {
    try {
      if (ttlInSeconds) {
        await this.redisClient.set(key, value, 'EX', ttlInSeconds);
      } else {
        await this.redisClient.set(key, value);
      }
    } catch (error: unknown) {
      let errorMessage = 'Error al establecer el valor en Redis';

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.error(errorMessage);
    }
  }

  // Método para obtener datos de Redis
  async get(key: string): Promise<any> {
    try {
      const data = await this.redisClient.get(key);
      if (data) {
        return JSON.parse(data);
      }
      return null;
    } catch (error: any) {
      console.error('Error al obtener datos de Redis:', error);
      return null;
    }
  }

  // Método para eliminar datos de Redis
  async del(key: string): Promise<void> {
    try {
      await this.redisClient.del(key);
      console.log(`Datos con la clave ${key} eliminados de Redis`);
    } catch (error: any) {
      console.error('Error al eliminar datos de Redis:', error);
    }
  }

  // Método para manejar bloqueos (lock) de recursos en Redis
  async acquireLock(key: string, ttlInSeconds: number): Promise<boolean> {
    try {
      const result = await this.redisClient.set(
        key,
        'locked',
        'EX',
        ttlInSeconds,
        'NX',
      );
      return result === 'OK';
    } catch (error: any) {
      console.error('Error al adquirir el bloqueo en Redis:', error);
      return false;
    }
  }

  // Método para liberar bloqueos en Redis
  async releaseLock(key: string): Promise<void> {
    try {
      await this.redisClient.del(key);
      console.log(`Bloqueo en la clave ${key} liberado`);
    } catch (error: any) {
      console.error('Error al liberar el bloqueo en Redis:', error);
    }
  }

  // Método para setear una clave solo si no existe
  async setIfNotExists(
    key: string,
    value: string,
    ttlInSeconds: number,
  ): Promise<boolean> {
    try {
      const result = await this.redisClient.set(
        key,
        'locked',
        'EX',
        ttlInSeconds,
        'NX',
      );
      return result === 'OK';
    } catch (error: unknown) {
      let errorMessage = 'Error al establecer el valor en Redis';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.error(errorMessage);
      return false;
    }
  }
}
