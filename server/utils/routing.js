import { haversineMeters } from "./geo.js";
import { shortestPath } from "./dijkstra.js";
import { pathGeometry, geometryLength } from "./pathGeometry.js";

const WALKING_SPEED = 1.4; // meters per second (a normal walking pace)
const MAX_DISTANCE_FROM_CAMPUS = 2000; // meters

const distanceBetween = (a, b) =>
  haversineMeters(a.latitude, a.longitude, b.latitude, b.longitude);

// Plans the shortest walking route to a destination building.
//
// buildings:       all buildings (plain objects)
// paths:           all paths, each { from, to, points } where points are the
//                  bend points [lat, lng] between the two buildings
// destinationId:   the building the user wants to reach
// startBuildingId: start from this building (optional)
// startLocation:   OR start from { latitude, longitude } (the user's GPS position)
//
// Returns { route } on success or { status, error } on failure.
export function planRoute({ buildings, paths, destinationId, startBuildingId, startLocation }) {
  const byId = new Map(buildings.map((b) => [String(b._id), b]));

  const destination = byId.get(String(destinationId));
  if (!destination) {
    return { status: 404, error: "Destination building not found." };
  }

  // ----- 1. Find where the route starts -----
  let startNode; // the building where the walking network starts
  let userPoint = null; // only set when we start from a GPS location
  let walkToNetwork = 0; // meters from the user to startNode

  if (startBuildingId) {
    startNode = byId.get(String(startBuildingId));
    if (!startNode) {
      return { status: 404, error: "Starting building not found." };
    }
    if (String(startNode._id) === String(destination._id)) {
      return { status: 400, error: "The start and the destination are the same building." };
    }
  } else {
    userPoint = {
      name: "Your location",
      latitude: startLocation.latitude,
      longitude: startLocation.longitude,
    };

    // Find the building nearest to the user
    let nearest = null;
    let nearestDistance = Infinity;
    for (const building of buildings) {
      const distance = distanceBetween(userPoint, building);
      if (distance < nearestDistance) {
        nearest = building;
        nearestDistance = distance;
      }
    }

    if (!nearest) {
      return { status: 404, error: "There are no buildings on the map yet." };
    }

    if (nearestDistance > MAX_DISTANCE_FROM_CAMPUS) {
      const km = (nearestDistance / 1000).toFixed(1);
      return {
        status: 422,
        error: `You are about ${km} km from the nearest campus building, so directions from your location are not available. Choose a building as your starting point instead.`,
      };
    }

    startNode = nearest;
    walkToNetwork = nearestDistance;
  }

  // ----- 2. Build the graph: buildings are nodes, paths are edges -----
  // Each edge remembers its bend points ("via") so the route can follow the real walkway.
  const graph = new Map();
  for (const building of buildings) {
    graph.set(String(building._id), []);
  }

  // Adds one direction of a path. If two paths connect the same buildings, keep the shorter.
  const addEdge = (fromId, toId, weight, via) => {
    const edges = graph.get(fromId);
    const existing = edges.find((edge) => edge.to === toId);

    if (!existing) {
      edges.push({ to: toId, weight, via });
    } else if (weight < existing.weight) {
      existing.weight = weight;
      existing.via = via;
    }
  };

  for (const path of paths) {
    const a = byId.get(String(path.from));
    const b = byId.get(String(path.to));
    if (!a || !b) continue; // ignore paths whose building was deleted

    const via = Array.isArray(path.points) ? path.points : [];
    const weight = geometryLength(pathGeometry(a, b, via));

    addEdge(String(a._id), String(b._id), weight, via);
    addEdge(String(b._id), String(a._id), weight, [...via].reverse());
  }

  // ----- 3. Run Dijkstra -----
  const result = shortestPath(graph, String(startNode._id), String(destination._id));
  if (!result) {
    return {
      status: 404,
      error:
        "No walking path was found between these buildings. An admin can connect them under Admin > Manage Paths.",
    };
  }

  // ----- 4. Build the answer for the website -----
  const buildingStops = result.path.map((id) => byId.get(id));

  // The edge used to walk from one building to the next
  const edgeBetween = (fromId, toId) => graph.get(fromId).find((edge) => edge.to === toId);

  const points = [];
  const steps = [];

  if (userPoint) {
    points.push([userPoint.latitude, userPoint.longitude]);
    steps.push({
      text: `Walk from ${userPoint.name} to ${buildingStops[0].name}`,
      distanceMeters: Math.round(walkToNetwork),
    });
  }

  for (let i = 0; i < buildingStops.length; i++) {
    points.push([buildingStops[i].latitude, buildingStops[i].longitude]);

    if (i < buildingStops.length - 1) {
      const edge = edgeBetween(result.path[i], result.path[i + 1]);
      points.push(...edge.via); // bend points of the real walkway

      steps.push({
        text: `Walk from ${buildingStops[i].name} to ${buildingStops[i + 1].name}`,
        distanceMeters: Math.round(edge.weight),
      });
    }
  }

  steps.push({ text: `You have arrived at ${destination.name}`, distanceMeters: 0 });

  const totalMeters = walkToNetwork + result.distance;
  const first = userPoint || buildingStops[0];

  return {
    route: {
      distanceMeters: Math.round(totalMeters),
      durationMinutes: Math.max(1, Math.ceil(totalMeters / WALKING_SPEED / 60)),
      from: {
        type: userPoint ? "location" : "building",
        name: first.name,
        latitude: first.latitude,
        longitude: first.longitude,
      },
      to: {
        id: String(destination._id),
        name: destination.name,
        code: destination.code,
        latitude: destination.latitude,
        longitude: destination.longitude,
      },
      points,
      stops: buildingStops.map((b) => ({
        _id: String(b._id),
        name: b.name,
        code: b.code,
        category: b.category,
        latitude: b.latitude,
        longitude: b.longitude,
      })),
      steps,
    },
  };
}