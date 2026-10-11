import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  // Close profile drawer on Esc key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setProfileOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Links in the navbar
  const links = [{ label: "Home", path: "/" }];

  if (user) {
    links.push({ label: "Explore Campus", path: "/explore" });
    if (user.role === "admin") {
      links.push({ label: "Admin", path: "/admin" });
    }
  } else {
    links.push({ label: "Login", path: "/login" });
    links.push({ label: "Register", path: "/register" });
  }

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate("/");
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          <span className="brand-badge">AU</span>
          <span>Campus Navigator</span>
        </Link>

        <div className="navbar-right">
          <ul className="navbar-links">
            {links.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  end
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Profile Logo Symbol trigger */}
          {user && (
            <button
              type="button"
              className={`navbar-profile-symbol ${profileOpen ? "active" : ""}`}
              onClick={() => setProfileOpen(!profileOpen)}
              title="Open Profile"
              aria-label="User Profile"
              aria-expanded={profileOpen}
            >
              <div className="profile-logo-badge">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <span className="profile-symbol-text">
                {user.name ? user.name.split(" ")[0] : "Profile"}
              </span>
            </button>
          )}
        </div>
      </nav>

      {/* Profile Flyout Drawer */}
      {user && profileOpen && (
        <>
          <div
            className="profile-backdrop"
            onClick={() => setProfileOpen(false)}
          />
          <aside className="profile-drawer" role="dialog" aria-label="User profile">
            <div className="profile-drawer-header">
              <div className="drawer-title-group">
                <div className="drawer-title-icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <h3>Profile & Account</h3>
              </div>
              <button
                type="button"
                className="profile-close-btn"
                onClick={() => setProfileOpen(false)}
                aria-label="Close profile drawer"
              >
                &times;
              </button>
            </div>

            <div className="profile-drawer-body">
              <div className="profile-avatar-card">
                <div className="profile-avatar-big">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <h4 className="profile-user-name">{user.name}</h4>
                <p className="profile-user-email">{user.email}</p>
                <span className={`profile-role-pill role-${user.role}`}>
                  {user.role === "admin" ? "Campus Administrator" : "Student"}
                </span>
              </div>

              <div className="profile-info-section">
                <div className="profile-info-row">
                  <span className="info-title">University</span>
                  <span className="info-detail">Anurag University, Hyderabad</span>
                </div>
                <div className="profile-info-row">
                  <span className="info-title">Campus</span>
                  <span className="info-detail">Venkatapur, Ghatkesar</span>
                </div>
                <div className="profile-info-row">
                  <span className="info-title">Access Status</span>
                  <span className="info-detail status-active">Active</span>
                </div>
              </div>

              <div className="profile-nav-actions">
                <Link
                  to="/profile"
                  className="drawer-action-link"
                  onClick={() => setProfileOpen(false)}
                >
                  <span>View Full Profile Details</span>
                  <span>&rarr;</span>
                </Link>
                <Link
                  to="/explore"
                  className="drawer-action-link"
                  onClick={() => setProfileOpen(false)}
                >
                  <span>Navigate Campus Map</span>
                  <span>&rarr;</span>
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="drawer-action-link admin-highlight"
                    onClick={() => setProfileOpen(false)}
                  >
                    <span>Manage Campus Buildings</span>
                    <span>&rarr;</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Logout positioned specifically in the LEFT BOTTOM CORNER */}
            <div className="profile-drawer-footer-left">
              <button
                type="button"
                className="profile-logout-btn"
                onClick={handleLogout}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  );
}

export default Navbar;