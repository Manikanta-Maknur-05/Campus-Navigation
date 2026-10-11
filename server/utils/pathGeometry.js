import { haversineMeters } from "./geo.js";

// The full shape of a path: start building, any bend points, end building.
// Each point is [latitude, longitude].
export const pathGeometry = (a, b, via = []) => [
  [a.latitude, a.longitude],
  ...via,
  [b.latitude, b.longitude],
];

// Length in meters of a line made of several points
export const geometryLength = (points) => {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += haversineMeters(points[i - 1][0], points[i - 1][1], points[i][0], points[i][1]);
  }
  return total;
};

// Checks the bend points sent by the path editor.
// Returns { error } if something is wrong, or { points } if everything is fine.
export function parsePoints(value, maxPoints = 100) {
  if (value === undefined || value === null) return { points: [] };

  if (!Array.isArray(value)) {
    return { error: "Points must be a list." };
  }
  if (value.length > maxPoints) {
    return { error: `A path can have at most ${maxPoints} bend points.` };
  }

  const points = [];
  for (const item of value) {
    if (!Array.isArray(item) || item.length !== 2) {
      return { error: "Each point must be [latitude, longitude]." };
    }

    const [lat, lng] = item;
    const valid =
      typeof lat === "number" &&
      typeof lng === "number" &&
      Number.isFinite(lat) &&
      Number.isFinite(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180;

    if (!valid) {
      return {
        error: "Each point needs a valid latitude (-90 to 90) and longitude (-180 to 180).",
      };
    }

    points.push([lat, lng]);
  }

  return { points };
}