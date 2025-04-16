import { IsString, IsArray, IsNotEmpty, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class RouteResponseDto {
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

  @IsArray()
  @IsNotEmpty()
  route: CoordinatesDto[];

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsNotEmpty()
  cacheTTL: number;
}

export class CoordinatesDto {
  @IsNotEmpty()
  lat: number;

  @IsNotEmpty()
  lng: number;
}
