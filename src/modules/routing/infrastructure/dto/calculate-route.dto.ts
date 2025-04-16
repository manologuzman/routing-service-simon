import {
  IsString,
  IsNotEmpty,
  IsObject,
  IsLatitude,
  IsLongitude,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CalculateRouteDto {
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @IsObject()
  @IsNotEmpty()
  @Type(() => CoordinatesDto)
  origin: CoordinatesDto;

  @IsObject()
  @IsNotEmpty()
  @Type(() => CoordinatesDto)
  destination: CoordinatesDto;
}

export class CoordinatesDto {
  @IsLatitude()
  lat: number;

  @IsLongitude()
  lng: number;
}
