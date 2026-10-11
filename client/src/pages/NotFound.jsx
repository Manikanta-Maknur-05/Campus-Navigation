import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="page">
      <h1>404 - Page Not Found</h1>
      <p className="subtitle">The page you are looking for does not exist.</p>
      <Link to="/" className="btn">
        Back to Home
      </Link>
    </main>
  );
}

export default NotFound;