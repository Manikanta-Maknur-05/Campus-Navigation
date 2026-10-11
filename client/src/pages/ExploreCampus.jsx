import { useEffect, useState } from "react";
import api from "../api/api.js";
import BuildingCard from "../components/BuildingCard.jsx";
import CampusMap from "../components/CampusMap.jsx";

function ExploreCampus() {
  const [buildings, setBuildings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load the category list once, for the dropdown
  useEffect(() => {
    api
      .get("/buildings/categories")
      .then((response) => setCategories(response.data))
      .catch(() => setCategories([]));
  }, []);

  // Load buildings whenever the search text or category changes.
  // The short delay waits until the user stops typing.
  useEffect(() => {
    setLoading(true);
    setError("");

    const timer = setTimeout(() => {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (category) params.category = category;

      api
        .get("/buildings", { params })
        .then((response) => setBuildings(response.data))
        .catch((err) => {
          const serverMessage = err.response?.data?.message;
          setError(serverMessage || "Cannot reach the backend. Is the server running?");
        })
        .finally(() => setLoading(false));
    }, 300);

    // Cancel the timer if the user types again before 300ms
    return () => clearTimeout(timer);
  }, [search, category]);

  const hasFilters = search.trim() !== "" || category !== "";

  const clearFilters = () => {
    setSearch("");
    setCategory("");
  };

  return (
    <main className="page">
      <h1>Explore Campus</h1>
      <p className="subtitle">Browse the main buildings and facilities on campus.</p>

      <div className="filter-bar">
        <input
          type="text"
          className="filter-input"
          placeholder="Search by name, code, or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="filter-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        {hasFilters && (
          <button type="button" className="btn btn-small" onClick={clearFilters}>
            Clear
          </button>
        )}
      </div>

      {loading && <p>Loading buildings...</p>}

      {error && <div className="status-card status-error">{error}</div>}

      {!error && buildings.length === 0 && !loading && (
        <div className="placeholder-box">
          {hasFilters ? (
            "No buildings match your search."
          ) : (
            <>
              No buildings found. Run <code>npm run seed</code> to add sample data.
            </>
          )}
        </div>
      )}

      {/* The map shows the same buildings as the list below it */}
      {!error && buildings.length > 0 && <CampusMap buildings={buildings} />}

      {!loading && !error && (
        <div className="building-list">
          {buildings.map((building) => (
            <BuildingCard key={building._id} building={building} />
          ))}
        </div>
      )}
    </main>
  );
}

export default ExploreCampus;