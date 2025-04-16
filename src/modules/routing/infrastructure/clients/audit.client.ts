import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { RouteResponseDto } from '../dto/route-response.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuditServiceClient {
  private readonly logger = new Logger(AuditServiceClient.name);

  constructor(private readonly httpService: HttpService) {}

  /**
   * Envía los datos de la ruta al servicio de auditoría.
   * @param routeData - Los datos de la ruta calculada.
   * @returns La respuesta del servicio de auditoría.
   */
  async sendRouteDataToAuditService(
    routeData: RouteResponseDto,
  ): Promise<AxiosResponse<any> | undefined> {
    try {
      const url = process.env.AUDIT_SERVICE_URL;
      if (!url) {
        throw new Error('Audit service URL is not defined in .env');
      }

      const response = await lastValueFrom(
        this.httpService.post(url, routeData),
      );

      this.logger.log('Route data successfully sent to audit service');

      if (!response) {
        throw new Error('No response received from audit service');
      }

      return response;
    } catch (error: unknown) {
      let errorMessage = 'Error sending route data to audit service';
      let errorStack = '';

      if (error instanceof Error) {
        errorMessage = error.message; // Accede al mensaje de error
        errorStack = error.stack || ''; // Accede a la pila de errores de forma segura
      }

      this.logger.error(errorMessage, errorStack);
      throw new Error('Failed to send data to audit service');
    }
  }
}
