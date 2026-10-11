import { useEffect, useState } from "react";
import api from "../api/api.js";

const formatDistance = (meters) =>
  meters >= 1000 ? `${(meters / 1000).toFixed(2)} km` : `${meters} m`;

// Asks the browser for the user's GPS location
function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Your browser does not support location."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      (error) => {
        if (error.code === 1) {
          reject(
            new Error(
              "Location permission was denied. Allow location access in your browser, or choose a building as the starting point."
            )
          );
        } else if (error.code === 3) {
          reject(new Error("Finding your location took too long. Please try again."));
        } else {
          reject(new Error("Your location is not available right now."));
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
}

// destinationId:  the building the user wants to reach
// onRouteChange:  called with the route (or null) so the page can draw it on the map
function DirectionsPanel({ destinationId, onRouteChange }) {
  const [buildings, setBuildings] = useState([]);
  const [from, setFrom] = useState("my-location");
  const [route, setRoute] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load buildings for the "Start from" dropdown
  useEffect(() => {
    api
      .get("/buildings")
      .then((response) => setBuildings(response.data))
      .catch(() => setBuildings([]));
  }, []);

  // Forget the old route when the user opens a different building
  useEffect(() => {
    setRoute(null);
    setError("");
    onRouteChange(null);
  }, [destinationId]);

  const getDirections = async () => {
    setError("");
    setLoading(true);

    try {
      const params = { toBuilding: destinationId };

      if (from === "my-location") {
        const coords = await getCurrentPosition();
        params.fromLat = coords.latitude;
        params.fromLng = coords.longitude;
        setAccuracy(Math.round(coords.accuracy));
      } else {
        params.fromBuilding = from;
        setAccuracy(null);
      }

      const response = await api.get("/route", { params });
      setRoute(response.data);
      onRouteChange(response.data);
    } catch (err) {
      setRoute(null);
      onRouteChange(null);
      setError(
        err.response?.data?.message ||
          (err.isAxiosError ? "Cannot reach the backend. Is the server running?" : err.message) ||
          "Could not get directions."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearRoute = () => {
    setRoute(null);
    setError("");
    onRouteChange(null);
  };

  return (
    <div className="directions-panel">
      <h2>Get Directions</h2>

      <label htmlFor="from">Start from</label>
      <select id="from" value={from} onChange={(e) => setFrom(e.target.value)}>
        <option value="my-location">My current location</option>
        {buildings
          .filter((b) => b._id !== destinationId)
          .map((b) => (
            <option key={b._id} value={b._id}>
              {b.code} - {b.name}
            </option>
          ))}
      </select>

      <div className="directions-buttons">
        <button type="button" className="btn btn-small" onClick={getDirections} disabled={loading}>
          {loading ? "Finding route..." : "Show shortest path"}
        </button>

        {route && (
          <button type="button" className="btn btn-small btn-secondary" onClick={clearRoute}>
            Clear route
          </button>
        )}
      </div>

      {error && <div className="status-card status-error">{error}</div>}

      {route && (
        <div className="route-summary">
          <p className="route-totals">
            <strong>{formatDistance(route.distanceMeters)}</strong> &middot; about{" "}
            <strong>{route.durationMinutes} min</strong> walking
          </p>

          {accuracy !== null && accuracy > 100 && (
            <p className="route-note">
              Your location is only accurate to about {accuracy} m, so the start of the route may be
              off. GPS works best outdoors on a phone.
            </p>
          )}

          <ol className="route-steps">
            {route.steps.map((step, index) => (
              <li key={index}>
                {step.text}
                {step.distanceMeters > 0 && <span> ({formatDistance(step.distanceMeters)})</span>}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

export default DirectionsPanel;