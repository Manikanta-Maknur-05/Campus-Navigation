import express from "express";
import mongoose from "mongoose";
import Building from "../models/Building.js";
import Path from "../models/Path.js";
import requireDatabase from "../middleware/requireDatabase.js";
import protect from "../middleware/authMiddleware.js";
import { planRoute } from "../utils/routing.js";

const router = express.Router();

// Turns a query string value into a number, or null if it is not valid
const parseCoordinate = (value, min, max) => {
  if (typeof value !== "string" || value.trim() === "") return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= min && number <= max ? number : null;
};

// GET /api/route?toBuilding=<id>&fromLat=17.4&fromLng=78.67
// GET /api/route?toBuilding=<id>&fromBuilding=<id>
router.get("/", requireDatabase, protect, async (req, res) => {
  const { toBuilding, fromBuilding, fromLat, fromLng } = req.query;

  if (typeof toBuilding !== "string" || !mongoose.isValidObjectId(toBuilding)) {
    return res.status(400).json({ message: "A valid destination building is required." });
  }

  let startBuildingId = null;
  let startLocation = null;

  if (typeof fromBuilding === "string" && fromBuilding !== "") {
    if (!mongoose.isValidObjectId(fromBuilding)) {
      return res.status(400).json({ message: "Invalid starting building." });
    }
    startBuildingId = fromBuilding;
  } else {
    const latitude = parseCoordinate(fromLat, -90, 90);
    const longitude = parseCoordinate(fromLng, -180, 180);

    if (latitude === null || longitude === null) {
      return res.status(400).json({
        message: "Your location is missing or invalid. Allow location access or choose a starting building.",
      });
    }
    startLocation = { latitude, longitude };
  }

  try {
    const buildings = await Building.find().lean();
    const paths = await Path.find().lean();

    const result = planRoute({
      buildings,
      paths,
      destinationId: toBuilding,
      startBuildingId,
      startLocation,
    });

    if (result.error) {
      return res.status(result.status).json({ message: result.error });
    }

    res.json(result.route);
  } catch (error) {
    console.error("Error planning route:", error.message);
    res.status(500).json({ message: "Could not plan the route." });
  }
});

export default router;