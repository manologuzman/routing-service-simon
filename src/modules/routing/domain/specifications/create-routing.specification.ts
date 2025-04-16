import { Specification } from 'src/core/specification.interface';
import { CreateRoutingDto } from '../../dto/create-routing.dto';

export class CreateRoutingSpecification
  implements Specification<CreateRoutingDto>
{
  isSatisfiedBy(dto: CreateRoutingDto): boolean {
    if (!dto.deviceId || typeof dto.deviceId !== 'string') return false;

    if (!this.isValidCoordinate(dto.origin?.lat, dto.origin?.lng)) return false;
    if (!this.isValidCoordinate(dto.destination?.lat, dto.destination?.lng))
      return false;

    return true;
  }

  private isValidCoordinate(lat: number, lng: number): boolean {
    const isLatValid = typeof lat === 'number' && lat >= -90 && lat <= 90;
    const isLngValid = typeof lng === 'number' && lng >= -180 && lng <= 180;
    return isLatValid && isLngValid;
  }
}
