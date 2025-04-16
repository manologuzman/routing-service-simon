import { isValidCoordinates } from './valid-coordinates';

describe('Coordinates Validation', () => {
  it('should return true for valid coordinates', () => {
    const validCoordinate = { lat: 4.710989, lng: -74.07209 }; // Coordenadas válidas
    expect(isValidCoordinates(validCoordinate)).toBe(true);
  });

  it('should return false for invalid latitude', () => {
    const invalidLatitude = { lat: 1000, lng: -74.07209 }; // Latitud fuera del rango
    expect(isValidCoordinates(invalidLatitude)).toBe(false);
  });

  it('should return false for invalid longitude', () => {
    const invalidLongitude = { lat: 4.710989, lng: 200 }; // Longitud fuera del rango
    expect(isValidCoordinates(invalidLongitude)).toBe(false);
  });

  it('should return false for invalid coordinates (both)', () => {
    const invalidCoordinates = { lat: 1000, lng: 200 }; // Ambas coordenadas fuera del rango
    expect(isValidCoordinates(invalidCoordinates)).toBe(false);
  });

  it('should return true for border case coordinates', () => {
    const borderCoordinates = [
      { lat: 90, lng: 0 }, // Latitud y longitud máximas válidas
      { lat: -90, lng: 0 }, // Latitud y longitud mínimas válidas
      { lat: 0, lng: 180 }, // Longitud máxima
      { lat: 0, lng: -180 }, // Longitud mínima
    ];

    borderCoordinates.forEach((coords) => {
      expect(isValidCoordinates(coords)).toBe(true);
    });
  });
});
