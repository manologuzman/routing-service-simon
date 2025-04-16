export class Route {
  deviceId: string;
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  route: { lat: number; lng: number }[];
  status: string;
  cacheTTL: number;

  constructor(
    deviceId: string,
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
    route: { lat: number; lng: number }[],
    status: string = 'success',
    cacheTTL: number = 300,
  ) {
    this.deviceId = deviceId;
    this.origin = origin;
    this.destination = destination;
    this.route = route;
    this.status = status;
    this.cacheTTL = cacheTTL;
  }
}
