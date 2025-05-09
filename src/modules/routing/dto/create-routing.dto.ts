import {
  IsNotEmpty,
  IsString,
  IsObject,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CoordinatesDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

export class CreateRoutingDto {
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @IsObject()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  origin: CoordinatesDto;

  @IsObject()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  destination: CoordinatesDto;
}
