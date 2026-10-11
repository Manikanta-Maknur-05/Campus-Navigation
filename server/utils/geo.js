// Straight-line distance in meters between two latitude/longitude points
// (the "haversine" formula, which accounts for the curve of the Earth)
export const haversineMeters = (lat1, lon1, lat2, lon2) => {
  const EARTH_RADIUS = 6371000; // meters
  const toRadians = (degrees) => (degrees * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;

  return 2 * EARTH_RADIUS * Math.asin(Math.sqrt(a));
};