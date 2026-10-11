import { haversineMeters } from "./geo.js";

const distanceBetween = (a, b) =>
  haversineMeters(a.latitude, a.longitude, b.latitude, b.longitude);

// Decides which buildings are connected by a walking path.
//  1. Every building is connected to its nearest neighbours.
//  2. If that leaves separate groups, the closest buildings from
//     different groups are connected until everything is one network.
// Returns a list of [buildingIdA, buildingIdB] pairs.
export function generatePathPairs(buildings, neighbours = 2) {
  const pairs = new Map(); // key = "idA-idB" (sorted), value = [idA, idB]

  const addPair = (a, b) => {
    const key = [String(a._id), String(b._id)].sort().join("-");
    pairs.set(key, [a._id, b._id]);
  };

  // Step 1: connect each building to its nearest neighbours
  for (const building of buildings) {
    buildings
      .filter((other) => String(other._id) !== String(building._id))
      .sort((x, y) => distanceBetween(building, x) - distanceBetween(building, y))
      .slice(0, neighbours)
      .forEach((other) => addPair(building, other));
  }

  // Step 2: join separate groups ("union-find" keeps track of the groups)
  const indexOf = new Map(buildings.map((b, i) => [String(b._id), i]));
  const parent = buildings.map((_, i) => i);

  const findGroup = (i) => {
    while (parent[i] !== i) {
      parent[i] = parent[parent[i]];
      i = parent[i];
    }
    return i;
  };

  const joinGroups = (i, j) => {
    parent[findGroup(i)] = findGroup(j);
  };

  for (const [idA, idB] of pairs.values()) {
    joinGroups(indexOf.get(String(idA)), indexOf.get(String(idB)));
  }

  while (true) {
    let best = null;

    for (let i = 0; i < buildings.length; i++) {
      for (let j = i + 1; j < buildings.length; j++) {
        if (findGroup(i) !== findGroup(j)) {
          const distance = distanceBetween(buildings[i], buildings[j]);
          if (!best || distance < best.distance) {
            best = { i, j, distance };
          }
        }
      }
    }

    if (!best) break; // everything is connected

    addPair(buildings[best.i], buildings[best.j]);
    joinGroups(best.i, best.j);
  }

  return Array.from(pairs.values());
}