import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/api.js";
import CampusMap from "../components/CampusMap.jsx";
import DirectionsPanel from "../components/DirectionsPanel.jsx";

function BuildingDetails() {
  const { id } = useParams(); // the :id part of /buildings/:id
  const [building, setBuilding] = useState(null);
  const [route, setRoute] = useState(null); // set by DirectionsPanel
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Which buildings to show on the map: the buildings along the route, or just this one
  const mapBuildings = useMemo(() => {
    if (route) return route.stops;
    return building ? [building] : [];
  }, [building, route]);

  // The green dot, only when the route starts from the user's GPS location
  const startPoint = useMemo(
    () =>
      route && route.from.type === "location"
        ? [route.from.latitude, route.from.longitude]
        : null,
    [route]
  );

  useEffect(() => {
    setLoading(true);
    setError("");

    api
      .get(`/buildings/${id}`)
      .then((response) => setBuilding(response.data))
      .catch((err) => {
        const serverMessage = err.response?.data?.message;
        setError(serverMessage || "Cannot reach the backend. Is the server running?");
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <main className="page">
      <Link to="/explore" className="back-link">
        &larr; Back to Explore Campus
      </Link>

      {loading && <p>Loading building...</p>}

      {error && <div className="status-card status-error">{error}</div>}

      {building && (
        <div className="details-card">
          <div className="details-header">
            <div className="building-code">{building.code}</div>
            <div>
              <h1>{building.name}</h1>
              <span className="building-category">{building.category}</span>
            </div>
          </div>

          <p className="details-description">{building.description}</p>

          <CampusMap
            buildings={mapBuildings}
            height={route ? "420px" : "300px"}
            showLink={false}
            routePoints={route ? route.points : null}
            startPoint={startPoint}
          />

          <DirectionsPanel destinationId={building._id} onRouteChange={setRoute} />

          <table className="details-table">
            <tbody>
              <tr>
                <th>Building code</th>
                <td>{building.code}</td>
              </tr>
              <tr>
                <th>Category</th>
                <td>{building.category}</td>
              </tr>
              <tr>
                <th>Latitude</th>
                <td>{building.latitude}</td>
              </tr>
              <tr>
                <th>Longitude</th>
                <td>{building.longitude}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default BuildingDetails;