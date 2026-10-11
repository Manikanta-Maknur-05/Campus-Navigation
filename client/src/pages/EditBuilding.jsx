import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/api.js";
import BuildingForm from "../components/BuildingForm.jsx";

function EditBuilding() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [building, setBuilding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/buildings/${id}`)
      .then((response) => setBuilding(response.data))
      .catch((err) => {
        setError(err.response?.data?.message || "Cannot reach the backend. Is the server running?");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data) => {
    await api.put(`/buildings/${id}`, data);
    navigate("/admin");
  };

  return (
    <main className="page">
      <Link to="/admin" className="back-link">
        &larr; Back to Manage Buildings
      </Link>
      <h1>Edit Building</h1>

      {loading && <p>Loading building...</p>}

      {error && <div className="status-card status-error">{error}</div>}

      {/* The form is shown only after the building has loaded */}
      {building && (
        <BuildingForm
          submitLabel="Save Changes"
          onSubmit={handleSubmit}
          initialValues={{
            name: building.name,
            code: building.code,
            category: building.category,
            description: building.description,
            latitude: String(building.latitude),
            longitude: String(building.longitude),
          }}
        />
      )}
    </main>
  );
}

export default EditBuilding;