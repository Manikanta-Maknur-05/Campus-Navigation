import { Link, useNavigate } from "react-router-dom";
import api from "../api/api.js";
import BuildingForm from "../components/BuildingForm.jsx";

function AddBuilding() {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    await api.post("/buildings", data);
    navigate("/admin");
  };

  return (
    <main className="page">
      <Link to="/admin" className="back-link">
        &larr; Back to Manage Buildings
      </Link>
      <h1>Add Building</h1>
      <BuildingForm submitLabel="Add Building" onSubmit={handleSubmit} />
    </main>
  );
}

export default AddBuilding;