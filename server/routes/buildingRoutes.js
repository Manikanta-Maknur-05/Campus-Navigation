import express from "express";
import mongoose from "mongoose";
import Building from "../models/Building.js";
import protect, { adminOnly } from "../middleware/authMiddleware.js";
import requireDatabase from "../middleware/requireDatabase.js";

const router = express.Router();

// Make user text safe to use inside a regular expression
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Returns a 503 response if MongoDB is not connected, otherwise returns false
const databaseNotReady = (res) => {
  // 1 = connected. Anything else means MongoDB is not ready.
  if (mongoose.connection.readyState !== 1) {
    res
      .status(503)
      .json({ message: "Database is not connected. Check MONGODB_URI." });
    return true;
  }
  return false;
};

const CATEGORIES = Building.schema.path("category").enumValues;

// True if value is a real number (not empty text) between min and max
const isNumberInRange = (value, min, max) => {
  const isNumberType = typeof value === "number";
  const isFilledText = typeof value === "string" && value.trim() !== "";
  if (!isNumberType && !isFilledText) return false;

  const number = Number(value);
  return Number.isFinite(number) && number >= min && number <= max;
};

// Reads and checks the building fields sent by the admin form.
// Returns { error } if something is wrong, or { data } if everything is fine.
const readBuildingFields = (body) => {
  const name = String(body.name || "").trim();
  const code = String(body.code || "").trim().toUpperCase();
  const description = String(body.description || "").trim();
  const category = String(body.category || "").trim();

  if (!name || !code) {
    return { error: "Name and code are required." };
  }
  if (!CATEGORIES.includes(category)) {
    return { error: `Category must be one of: ${CATEGORIES.join(", ")}.` };
  }
  if (!isNumberInRange(body.latitude, -90, 90)) {
    return { error: "Latitude must be a number between -90 and 90." };
  }
  if (!isNumberInRange(body.longitude, -180, 180)) {
    return { error: "Longitude must be a number between -180 and 180." };
  }

  return {
    data: {
      name,
      code,
      description,
      category,
      latitude: Number(body.latitude),
      longitude: Number(body.longitude),
    },
  };
};

// ---------- Authenticated routes (logged-in students/users) ----------

// GET /api/buildings/categories - list of allowed categories
// (this route must come BEFORE "/:id", or "categories" would be treated as an id)
router.get("/categories", requireDatabase, protect, (req, res) => {
  res.json(CATEGORIES);
});

// GET /api/buildings?search=lib&category=Library
// Returns all buildings, or only those matching the search text and/or category
router.get("/", requireDatabase, protect, async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};

    if (typeof category === "string" && category.trim()) {
      filter.category = category.trim();
    }

    if (typeof search === "string" && search.trim()) {
      const pattern = new RegExp(escapeRegex(search.trim()), "i");
      filter.$or = [{ name: pattern }, { description: pattern }, { code: pattern }];
    }

    const buildings = await Building.find(filter).sort({ code: 1 });
    res.json(buildings);
  } catch (error) {
    console.error("Error fetching buildings:", error.message);
    res.status(500).json({ message: "Could not fetch buildings." });
  }
});

// GET /api/buildings/:id - one building
router.get("/:id", requireDatabase, protect, async (req, res) => {

  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid building id." });
  }

  try {
    const building = await Building.findById(req.params.id);

    if (!building) {
      return res.status(404).json({ message: "Building not found." });
    }

    res.json(building);
  } catch (error) {
    console.error("Error fetching building:", error.message);
    res.status(500).json({ message: "Could not fetch the building." });
  }
});

// ---------- Admin routes (login + admin role required) ----------

// POST /api/buildings - add a new building
router.post("/", requireDatabase, protect, adminOnly, async (req, res) => {
  const result = readBuildingFields(req.body);
  if (result.error) {
    return res.status(400).json({ message: result.error });
  }

  try {
    const existing = await Building.findOne({ code: result.data.code });
    if (existing) {
      return res.status(409).json({ message: "A building with this code already exists." });
    }

    const building = await Building.create(result.data);
    res.status(201).json(building);
  } catch (error) {
    console.error("Error creating building:", error.message);
    res.status(500).json({ message: "Could not create the building." });
  }
});

// PUT /api/buildings/:id - update a building
router.put("/:id", requireDatabase, protect, adminOnly, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid building id." });
  }

  const result = readBuildingFields(req.body);
  if (result.error) {
    return res.status(400).json({ message: result.error });
  }

  try {
    const building = await Building.findById(req.params.id);
    if (!building) {
      return res.status(404).json({ message: "Building not found." });
    }

    // The code must stay unique (ignore this building itself)
    const duplicate = await Building.findOne({
      code: result.data.code,
      _id: { $ne: building._id },
    });
    if (duplicate) {
      return res.status(409).json({ message: "A building with this code already exists." });
    }

    building.set(result.data);
    await building.save();
    res.json(building);
  } catch (error) {
    console.error("Error updating building:", error.message);
    res.status(500).json({ message: "Could not update the building." });
  }
});

// DELETE /api/buildings/:id - delete a building
router.delete("/:id", requireDatabase, protect, adminOnly, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid building id." });
  }

  try {
    const building = await Building.findByIdAndDelete(req.params.id);
    if (!building) {
      return res.status(404).json({ message: "Building not found." });
    }

    res.json({ message: "Building deleted." });
  } catch (error) {
    console.error("Error deleting building:", error.message);
    res.status(500).json({ message: "Could not delete the building." });
  }
});

export default router;