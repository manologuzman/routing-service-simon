import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateRoutingDto } from '../dto/create-routing.dto';
import { CreateRoutingUseCase } from '../../../modules/routing/use-cases/create-routing.usecase';

@Controller('routing')
export class RoutingController {
  constructor(private readonly createRoutingUseCase: CreateRoutingUseCase) {}

  @Post()
  async createRoute(@Body() body: CreateRoutingDto) {
    // Validación manual (opcional si usas Pipes globales)
    const dto = plainToInstance(CreateRoutingDto, body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new HttpException(
        { message: 'Errores de validación', errors },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const routeResult = await this.createRoutingUseCase.execute(dto);
      return routeResult;
    } catch (error: unknown) {
      let errorMessage = 'Error al procesar la ruta';

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      throw new HttpException(
        {
          message: errorMessage,
          details: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
