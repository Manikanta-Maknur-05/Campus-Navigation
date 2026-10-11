import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Wrap a page with this to make it available to logged-in users only.
// Add the adminOnly prop to limit it to admins:  <ProtectedRoute adminOnly>
function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <main className="page">
        <p>Checking login...</p>
      </main>
    );
  }

  if (!user) {
    // Send the visitor to /login and remember where they wanted to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return (
      <main className="page">
        <h1>Access denied</h1>
        <p className="subtitle">You need an admin account to open this page.</p>
        <Link to="/" className="btn">
          Back to Home
        </Link>
      </main>
    );
  }

  return children;
}

export default ProtectedRoute;