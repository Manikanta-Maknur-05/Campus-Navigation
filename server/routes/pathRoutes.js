import express from "express";
import mongoose from "mongoose";
import Building from "../models/Building.js";
import Path from "../models/Path.js";
import protect, { adminOnly } from "../middleware/authMiddleware.js";
import requireDatabase from "../middleware/requireDatabase.js";
import { generatePathPairs } from "../utils/generatePathPairs.js";
import { pathGeometry, geometryLength, parsePoints } from "../utils/pathGeometry.js";

const router = express.Router();

// Every route in this file needs: database + login + admin role
router.use(requireDatabase, protect, adminOnly);

// GET /api/paths - all paths, with their length in meters
router.get("/", async (req, res) => {
  try {
    const buildings = await Building.find().lean();
    const byId = new Map(buildings.map((b) => [String(b._id), b]));
    const paths = await Path.find().sort({ createdAt: 1 }).lean();

    const result = paths.map((path) => {
      const a = byId.get(String(path.from));
      const b = byId.get(String(path.to));
      const points = path.points || [];

      return {
        _id: path._id,
        from: path.from,
        to: path.to,
        points,
        // null means one of the buildings was deleted
        lengthMeters: a && b ? Math.round(geometryLength(pathGeometry(a, b, points))) : null,
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Error fetching paths:", error.message);
    res.status(500).json({ message: "Could not fetch paths." });
  }
});

// POST /api/paths - add one path. Body: { from, to, points }
router.post("/", async (req, res) => {
  const { from, to } = req.body;

  if (
    typeof from !== "string" ||
    typeof to !== "string" ||
    !mongoose.isValidObjectId(from) ||
    !mongoose.isValidObjectId(to)
  ) {
    return res.status(400).json({ message: "Choose two buildings." });
  }
  if (from === to) {
    return res.status(400).json({ message: "A path needs two different buildings." });
  }

  const parsed = parsePoints(req.body.points);
  if (parsed.error) {
    return res.status(400).json({ message: parsed.error });
  }

  try {
    const count = await Building.countDocuments({ _id: { $in: [from, to] } });
    if (count !== 2) {
      return res.status(404).json({ message: "One of the buildings was not found." });
    }

    // A path works both ways, so check A-B and B-A
    const existing = await Path.findOne({
      $or: [
        { from, to },
        { from: to, to: from },
      ],
    });
    if (existing) {
      return res
        .status(409)
        .json({ message: "These buildings are already connected. Delete the old path first." });
    }

    const path = await Path.create({ from, to, points: parsed.points });
    res.status(201).json(path);
  } catch (error) {
    console.error("Error creating path:", error.message);
    res.status(500).json({ message: "Could not create the path." });
  }
});

// POST /api/paths/generate - replace ALL paths with automatic straight-line paths
router.post("/generate", async (req, res) => {
  try {
    const buildings = await Building.find().lean();

    if (buildings.length < 2) {
      return res.status(400).json({ message: "You need at least 2 buildings." });
    }

    const pairs = generatePathPairs(buildings);

    await Path.deleteMany({});
    await Path.insertMany(pairs.map(([from, to]) => ({ from, to })));

    res.json({ created: pairs.length });
  } catch (error) {
    console.error("Error generating paths:", error.message);
    res.status(500).json({ message: "Could not generate paths." });
  }
});

// DELETE /api/paths - delete ALL paths
router.delete("/", async (req, res) => {
  try {
    const result = await Path.deleteMany({});
    res.json({ deleted: result.deletedCount });
  } catch (error) {
    console.error("Error deleting paths:", error.message);
    res.status(500).json({ message: "Could not delete the paths." });
  }
});

// DELETE /api/paths/:id - delete one path
router.delete("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid path id." });
  }

  try {
    const path = await Path.findByIdAndDelete(req.params.id);
    if (!path) {
      return res.status(404).json({ message: "Path not found." });
    }

    res.json({ message: "Path deleted." });
  } catch (error) {
    console.error("Error deleting path:", error.message);
    res.status(500).json({ message: "Could not delete the path." });
  }
});

export default router;