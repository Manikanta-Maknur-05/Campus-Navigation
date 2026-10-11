import dotenv from "dotenv";
import mongoose from "mongoose";
import dns from "node:dns";
import { fileURLToPath } from "node:url";
import Building from "../models/Building.js";
import Path from "../models/Path.js";
import { generatePathPairs } from "../utils/generatePathPairs.js";
import { haversineMeters } from "../utils/geo.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

// Always read server/.env, no matter which folder you run this from
dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

const generate = async () => {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is missing. Add it to server/.env");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
    });

    const buildings = await Building.find().lean();

    if (buildings.length < 2) {
      console.error("You need at least 2 buildings. Run: npm run seed");
      process.exitCode = 1;
      return;
    }

    const pairs = generatePathPairs(buildings);

    // Replace all old paths with the new ones
    await Path.deleteMany({});
    await Path.insertMany(pairs.map(([from, to]) => ({ from, to })));

    const byId = new Map(buildings.map((b) => [String(b._id), b]));
    console.log(`Created ${pairs.length} paths between ${buildings.length} buildings:`);

    for (const [idA, idB] of pairs) {
      const a = byId.get(String(idA));
      const b = byId.get(String(idB));
      const meters = Math.round(haversineMeters(a.latitude, a.longitude, b.latitude, b.longitude));
      console.log(`  ${a.code} (${a.name}) <-> ${b.code} (${b.name}): ${meters} m`);
    }
  } catch (error) {
    console.error("Failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

generate();