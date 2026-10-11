import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Login() {
  const { user, login } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Go back to the page the visitor wanted, or to explore campus
  const redirectTo = location.state?.from?.pathname || "/explore";

  // Already logged in? Skip the form.
  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
      // After login, "user" is set and the check above redirects automatically
    } catch (err) {
      setError(err.response?.data?.message || "Cannot reach the backend. Is the server running?");
      setSubmitting(false);
    }
  };

  return (
    <main className="page">
      <h1>Login</h1>
      <p className="subtitle">Log in to your Campus Navigator account.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <div className="status-card status-error">{error}</div>}

        <button type="submit" className="btn btn-small" disabled={submitting}>
          {submitting ? "Logging in..." : "Login"}
        </button>

        <p className="auth-switch">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </main>
  );
}

export default Login;