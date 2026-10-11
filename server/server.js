import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import buildingRoutes from "./routes/buildingRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import routeRoutes from "./routes/routeRoutes.js";
import pathRoutes from "./routes/pathRoutes.js";

// Load variables from server/.env into process.env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Warn if the login secret is missing or still the example value
if (
  !process.env.JWT_SECRET ||
  process.env.JWT_SECRET === "change-this-to-a-long-random-string"
) {
  console.warn(
    "WARNING: Set a real JWT_SECRET in server/.env before using login."
  );
}

// Allow the React app to call this server
app.use(cors({ origin: CLIENT_URL }));

// Allow the server to read JSON request bodies
app.use(express.json());

// Health-check endpoint: GET /api/health
app.get("/api/health", (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;

  res.json({
    status: "ok",
    message: "Campus Navigation backend is running",
    database: dbConnected ? "connected" : "not connected",
    timestamp: new Date().toISOString(),
  });
});

// Building routes: /api/buildings
app.use("/api/buildings", buildingRoutes);

// Auth routes: /api/auth/register, /api/auth/login, /api/auth/me
app.use("/api/auth", authRoutes);
// Route planning: GET /api/route
app.use("/api/route", routeRoutes);
// Path management (admin only): /api/paths
app.use("/api/paths", pathRoutes);

// Connect to MongoDB, then start the server.
// connectDB never crashes the app, so /api/health works even without a database.
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});