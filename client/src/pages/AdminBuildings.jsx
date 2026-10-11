import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api.js";

function AdminBuildings() {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/buildings")
      .then((response) => setBuildings(response.data))
      .catch((err) => {
        setError(err.response?.data?.message || "Cannot reach the backend. Is the server running?");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (building) => {
    const confirmed = window.confirm(`Delete "${building.name}"? This cannot be undone.`);
    if (!confirmed) return;

    setError("");

    try {
      await api.delete(`/buildings/${building._id}`);
      // Remove it from the list on screen
      setBuildings((current) => current.filter((item) => item._id !== building._id));
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete the building.");
    }
  };

  return (
    <main className="page">
      <h1>Admin: Manage Buildings</h1>
      <p className="subtitle">Add, edit, or delete the buildings shown on the campus.</p>

            <div className="admin-toolbar">
        <Link to="/admin/paths" className="btn btn-secondary">
          Manage Paths
        </Link>
        <Link to="/admin/buildings/new" className="btn">
          + Add Building
        </Link>
      </div>

      {loading && <p>Loading buildings...</p>}

      {error && <div className="status-card status-error">{error}</div>}

      {!loading && buildings.length === 0 && !error && (
        <div className="placeholder-box">No buildings yet. Add the first one.</div>
      )}

      {buildings.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Block</th>
              <th>Name</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {buildings.map((building) => (
              <tr key={building._id}>
                <td>{building.code}</td>
                <td>{building.name}</td>
                <td>{building.category}</td>
                <td>
                  <div className="admin-actions">
                    <Link to={`/admin/buildings/${building._id}/edit`} className="btn btn-small">
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="btn btn-small btn-danger"
                      onClick={() => handleDelete(building)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

export default AdminBuildings;