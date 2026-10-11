import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  CircleMarker,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Used only when there are no buildings to show
const DEFAULT_CENTER = [17.4, 78.67];

// Creates a round blue marker that shows the building code (A, B, C...)
function createIcon(code) {
  const element = document.createElement("div");
  element.className = "map-marker";
  element.textContent = code; // textContent is safe even if the code contains symbols

  return L.divIcon({
    className: "map-marker-wrapper",
    html: element,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
}

// Moves and zooms the map so that everything important is visible
function FitBounds({ positions }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length === 0) return;

    if (positions.length === 1) {
      map.setView(positions[0], 17);
    } else {
      map.fitBounds(positions, { padding: [40, 40], maxZoom: 18 });
    }
  }, [positions, map]);

  return null;
}

// buildings:   the buildings to show as markers
// routePoints: optional list of [lat, lng] points. A blue line is drawn through them.
// startPoint:  optional [lat, lng] for the user's own location (green dot)
function CampusMap({
  buildings,
  height = "420px",
  showLink = true,
  routePoints = null,
  startPoint = null,
}) {
  // Build marker data only when the buildings list changes
  const markers = useMemo(
    () =>
      buildings
        .filter((b) => Number.isFinite(b.latitude) && Number.isFinite(b.longitude))
        .map((b) => ({
          building: b,
          position: [b.latitude, b.longitude],
          icon: createIcon(b.code),
        })),
    [buildings]
  );

  const positions = useMemo(() => markers.map((m) => m.position), [markers]);
  const hasRoute = routePoints && routePoints.length > 1;

  // When a route is shown, zoom to the route. Otherwise zoom to the markers.
  const fitPositions = hasRoute ? routePoints : positions;
  const center = fitPositions[0] || DEFAULT_CENTER;

  return (
    <div className="campus-map" style={{ height }}>
      <MapContainer
        center={center}
        zoom={16}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds positions={fitPositions} />

        {hasRoute && (
          <Polyline
            positions={routePoints}
            pathOptions={{ color: "#2563eb", weight: 5, opacity: 0.85 }}
          />
        )}

        {startPoint && (
          <CircleMarker
            center={startPoint}
            radius={9}
            pathOptions={{ color: "#ffffff", weight: 3, fillColor: "#16a34a", fillOpacity: 1 }}
          >
            <Popup>Your location</Popup>
          </CircleMarker>
        )}

        {markers.map(({ building, position, icon }) => (
          <Marker key={building._id} position={position} icon={icon}>
            <Popup>
              <div className="map-popup">
                <strong>{building.name}</strong>
                <br />
                {building.category}
                {showLink && (
                  <>
                    <br />
                    <Link to={`/buildings/${building._id}`}>Details &amp; directions</Link>
                  </>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default CampusMap;