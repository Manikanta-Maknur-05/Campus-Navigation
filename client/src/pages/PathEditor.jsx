import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api.js";
import PathEditorMap from "../components/PathEditorMap.jsx";

const getErrorMessage = (err) =>
  err.response?.data?.message || "Cannot reach the backend. Is the server running?";

function PathEditor() {
  const [buildings, setBuildings] = useState([]);
  const [paths, setPaths] = useState([]);
  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [points, setPoints] = useState([]); // bend points added by clicking the map
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Load buildings and paths
  const loadData = async () => {
    try {
      const [buildingsResponse, pathsResponse] = await Promise.all([
        api.get("/buildings"),
        api.get("/paths"),
      ]);
      setBuildings(buildingsResponse.data);
      setPaths(pathsResponse.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const byId = useMemo(() => new Map(buildings.map((b) => [b._id, b])), [buildings]);
  const fromBuilding = byId.get(fromId);
  const toBuilding = byId.get(toId);

  // The orange dashed line: from building -> bend points -> to building
  const previewLine = useMemo(() => {
    if (!fromBuilding || !toBuilding) return null;
    return [
      [fromBuilding.latitude, fromBuilding.longitude],
      ...points,
      [toBuilding.latitude, toBuilding.longitude],
    ];
  }, [fromBuilding, toBuilding, points]);

  // The grey lines: paths that are already saved
  const existingLines = useMemo(
    () =>
      paths
        .map((path) => {
          const a = byId.get(String(path.from));
          const b = byId.get(String(path.to));
          if (!a || !b) return null;

          return {
            id: path._id,
            positions: [[a.latitude, a.longitude], ...path.points, [b.latitude, b.longitude]],
          };
        })
        .filter(Boolean),
    [paths, byId]
  );

  const drawing = Boolean(fromBuilding && toBuilding);

  const handleMapClick = (point) => {
    if (!drawing) return; // clicks only add points after both buildings are chosen
    setPoints((current) => [...current, point]);
    setMessage("");
  };

  const handleSave = async () => {
    setError("");
    setMessage("");
    setSaving(true);

    try {
      await api.post("/paths", { from: fromId, to: toId, points });
      setMessage("Path saved.");
      setFromId("");
      setToId("");
      setPoints([]);
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (path) => {
    if (!window.confirm("Delete this path?")) return;

    setError("");
    setMessage("");

    try {
      await api.delete(`/paths/${path._id}`);
      setPaths((current) => current.filter((item) => item._id !== path._id));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleGenerate = async () => {
    const confirmed = window.confirm(
      "This replaces ALL paths with automatic straight-line paths. Continue?"
    );
    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      const response = await api.post("/paths/generate");
      setMessage(`Created ${response.data.created} automatic paths.`);
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Delete ALL paths? This cannot be undone.")) return;

    setError("");
    setMessage("");

    try {
      await api.delete("/paths");
      setPaths([]);
      setMessage("All paths deleted.");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const label = (building) => (building ? `${building.code} - ${building.name}` : "Deleted building");

  return (
    <main className="page">
      <Link to="/admin" className="back-link">
        &larr; Back to Manage Buildings
      </Link>
      <h1>Admin: Manage Paths</h1>
      <p className="subtitle">
        Draw the real walkways between buildings. Routes and directions follow these paths.
      </p>

      {loading && <p>Loading...</p>}

      {error && <div className="status-card status-error">{error}</div>}
      {message && <div className="status-card status-ok">{message}</div>}

      {!loading && (
        <>
          <div className="path-form">
            <h2>Add a path</h2>
            <ol className="path-help">
              <li>Choose the two buildings that the walkway connects.</li>
              <li>
                Click the map along the real walkway to add bend points (use the Satellite layer at
                the top right of the map to see the walkways).
              </li>
              <li>Press Save path.</li>
            </ol>

            <div className="path-selects">
              <div>
                <label htmlFor="pathFrom">From</label>
                <select id="pathFrom" value={fromId} onChange={(e) => setFromId(e.target.value)}>
                  <option value="">Select a building</option>
                  {buildings
                    .filter((b) => b._id !== toId)
                    .map((b) => (
                      <option key={b._id} value={b._id}>
                        {label(b)}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label htmlFor="pathTo">To</label>
                <select id="pathTo" value={toId} onChange={(e) => setToId(e.target.value)}>
                  <option value="">Select a building</option>
                  {buildings
                    .filter((b) => b._id !== fromId)
                    .map((b) => (
                      <option key={b._id} value={b._id}>
                        {label(b)}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <p className="path-status">
              {drawing
                ? `Bend points added: ${points.length}. Click the map to add more.`
                : "Choose both buildings to start drawing."}
            </p>

            <div className="directions-buttons">
              <button
                type="button"
                className="btn btn-small"
                onClick={handleSave}
                disabled={!drawing || saving}
              >
                {saving ? "Saving..." : "Save path"}
              </button>
              <button
                type="button"
                className="btn btn-small btn-secondary"
                onClick={() => setPoints((current) => current.slice(0, -1))}
                disabled={points.length === 0}
              >
                Undo last point
              </button>
              <button
                type="button"
                className="btn btn-small btn-secondary"
                onClick={() => setPoints([])}
                disabled={points.length === 0}
              >
                Clear points
              </button>
            </div>
          </div>

          <PathEditorMap
            buildings={buildings}
            existingLines={existingLines}
            previewLine={previewLine}
            bendPoints={points}
            drawing={drawing}
            onMapClick={handleMapClick}
          />

          <p className="path-legend">
            Grey lines are saved paths. The orange dashed line is the path you are drawing.
          </p>

          <div className="admin-toolbar">
            <button type="button" className="btn btn-small btn-secondary" onClick={handleGenerate}>
              Auto-generate paths
            </button>
            <button
              type="button"
              className="btn btn-small btn-danger"
              onClick={handleDeleteAll}
              disabled={paths.length === 0}
            >
              Delete all paths
            </button>
          </div>

          {paths.length === 0 ? (
            <div className="placeholder-box">
              No paths yet. Draw one above, or press Auto-generate paths to start with straight-line
              paths.
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>From</th>
                  <th>To</th>
                  <th>Length</th>
                  <th>Bend points</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paths.map((path) => (
                  <tr key={path._id}>
                    <td>{label(byId.get(String(path.from)))}</td>
                    <td>{label(byId.get(String(path.to)))}</td>
                    <td>{path.lengthMeters === null ? "-" : `${path.lengthMeters} m`}</td>
                    <td>{path.points.length}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-small btn-danger"
                        onClick={() => handleDelete(path)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </main>
  );
}

export default PathEditor;