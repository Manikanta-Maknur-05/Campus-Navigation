import { useEffect, useState } from "react";
import api from "../api/api.js";

// One form used for both "Add building" and "Edit building"
function BuildingForm({ initialValues, submitLabel, onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    code: "",
    category: "",
    description: "",
    latitude: "",
    longitude: "",
    ...initialValues,
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Load the category list for the dropdown
  useEffect(() => {
    api
      .get("/buildings/categories")
      .then((response) => setCategories(response.data))
      .catch(() => setCategories([]));
  }, []);

  // Update one field when the user types
  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const latitude = Number(form.latitude);
    const longitude = Number(form.longitude);

    if (form.latitude === "" || Number.isNaN(latitude)) {
      setError("Latitude must be a number.");
      return;
    }
    if (form.longitude === "" || Number.isNaN(longitude)) {
      setError("Longitude must be a number.");
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit({
        name: form.name,
        code: form.code,
        category: form.category,
        description: form.description,
        latitude,
        longitude,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Is the server running?");
      setSubmitting(false);
    }
  };

  return (
    <form className="auth-form admin-form" onSubmit={handleSubmit}>
      <label htmlFor="name">Name</label>
      <input id="name" name="name" type="text" value={form.name} onChange={handleChange} required />

      <label htmlFor="code">Block (for example A, B, F1)</label>
      <input id="code" name="code" type="text" value={form.code} onChange={handleChange} required />

      <label htmlFor="category">Category</label>
      <select id="category" name="category" value={form.category} onChange={handleChange} required>
        <option value="">Select a category</option>
        {categories.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>

      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        name="description"
        rows="3"
        value={form.description}
        onChange={handleChange}
      />

      <label htmlFor="latitude">Latitude</label>
      <input
        id="latitude"
        name="latitude"
        type="number"
        step="any"
        value={form.latitude}
        onChange={handleChange}
        required
      />

      <label htmlFor="longitude">Longitude</label>
      <input
        id="longitude"
        name="longitude"
        type="number"
        step="any"
        value={form.longitude}
        onChange={handleChange}
        required
      />

      {error && <div className="status-card status-error">{error}</div>}

      <button type="submit" className="btn btn-small" disabled={submitting}>
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

export default BuildingForm;