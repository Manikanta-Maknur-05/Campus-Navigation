import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api.js";

// AuthContext lets every page know who is logged in
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check the saved token

  // When the app opens, check if a saved token is still valid
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((response) => setUser(response.data.user))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  // Save the token and the user after a successful login or register
  const saveSession = (data) => {
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  const register = async (name, email, password) => {
    const response = await api.post("/auth/register", { name, email, password });
    saveSession(response.data);
  };

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    saveSession(response.data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Small helper so pages can write:  const { user } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}