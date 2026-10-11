// Dijkstra's shortest path algorithm.
//
// graph:   a Map where each key is a node id and each value is a list of
//          edges like { to: "otherNodeId", weight: 120 }
// startId: the node to start from
// endId:   the node to reach
//
// Returns { distance, path } where path is the list of node ids from start
// to end, or null if the end cannot be reached.
export function shortestPath(graph, startId, endId) {
  if (!graph.has(startId) || !graph.has(endId)) return null;

  const distances = new Map(); // best known distance from start to each node
  const previous = new Map(); // which node we came from on the best route
  const visited = new Set();

  // At the beginning every node is "infinitely far", except the start
  for (const id of graph.keys()) {
    distances.set(id, Infinity);
  }
  distances.set(startId, 0);

  while (true) {
    // Step 1: pick the unvisited node with the smallest known distance
    let currentId = null;
    let smallest = Infinity;
    for (const [id, distance] of distances) {
      if (!visited.has(id) && distance < smallest) {
        smallest = distance;
        currentId = id;
      }
    }

    // Nothing reachable is left, or we reached the destination
    if (currentId === null || currentId === endId) break;

    visited.add(currentId);

    // Step 2: see if going through this node gives a shorter route to its neighbours
    for (const edge of graph.get(currentId)) {
      const newDistance = smallest + edge.weight;
      if (newDistance < distances.get(edge.to)) {
        distances.set(edge.to, newDistance);
        previous.set(edge.to, currentId);
      }
    }
  }

  if (distances.get(endId) === Infinity) return null;

  // Walk backwards from the end to the start to build the route
  const path = [];
  let step = endId;
  while (step !== undefined) {
    path.unshift(step);
    step = previous.get(step);
  }

  return { distance: distances.get(endId), path };
}