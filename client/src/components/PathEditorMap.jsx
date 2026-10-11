import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  Marker,
  Popup,
  Polyline,
  CircleMarker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER = [17.4, 78.67];

// Round blue marker that shows the building code
function createIcon(code) {
  const element = document.createElement("div");
  element.className = "map-marker";
  element.textContent = code;

  return L.divIcon({
    className: "map-marker-wrapper",
    html: element,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
}

// Zooms the map so that all buildings are visible
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

// Tells the page where the user clicked on the map
function ClickHandler({ onMapClick }) {
  useMapEvents({
    click: (event) => {
      onMapClick([
        Number(event.latlng.lat.toFixed(6)),
        Number(event.latlng.lng.toFixed(6)),
      ]);
    },
  });
  return null;
}

// buildings:     all buildings (blue markers)
// existingLines: saved paths, each { id, positions } (grey lines)
// previewLine:   the path being drawn right now (orange dashed line), or null
// bendPoints:    the bend points added so far (small orange dots)
// drawing:       true when clicks on the map should add bend points
function PathEditorMap({
  buildings,
  existingLines,
  previewLine,
  bendPoints,
  drawing,
  onMapClick,
  height = "520px",
}) {
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
  const center = positions[0] || DEFAULT_CENTER;

  return (
    <div
      className={drawing ? "campus-map path-editor-map drawing" : "campus-map path-editor-map"}
      style={{ height }}
    >
      <MapContainer
        center={center}
        zoom={16}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Street map">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              attribution="Tiles &copy; Esri"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        <FitBounds positions={positions} />
        <ClickHandler onMapClick={onMapClick} />

        {existingLines.map((line) => (
          <Polyline
            key={line.id}
            positions={line.positions}
            pathOptions={{ color: "#6b7280", weight: 4, opacity: 0.9 }}
          />
        ))}

        {previewLine && (
          <Polyline
            positions={previewLine}
            pathOptions={{ color: "#ea580c", weight: 4, dashArray: "8 8" }}
          />
        )}

        {bendPoints.map((point, index) => (
          <CircleMarker
            key={index}
            center={point}
            radius={6}
            pathOptions={{ color: "#ffffff", weight: 2, fillColor: "#ea580c", fillOpacity: 1 }}
          />
        ))}

        {markers.map(({ building, position, icon }) => (
          <Marker key={building._id} position={position} icon={icon}>
            <Popup>
              <strong>{building.name}</strong>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default PathEditorMap;