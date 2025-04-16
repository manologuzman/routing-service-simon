export function isValidCoordinates(coordinates: {
  lat: number;
  lng: number;
}): boolean {
  const { lat, lng } = coordinates;

  // Verificar que la latitud esté en el rango [-90, 90] y la longitud en el rango [-180, 180]
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}
