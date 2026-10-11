import { Link } from "react-router-dom";

function BuildingCard({ building }) {
  return (
    <Link to={`/buildings/${building._id}`} className="building-card">
      <div className="building-code">{building.code}</div>
      <div className="building-info">
        <h3>{building.name}</h3>
        <p>{building.description}</p>
        <span className="building-category">{building.category}</span>
      </div>
    </Link>
  );
}

export default BuildingCard;