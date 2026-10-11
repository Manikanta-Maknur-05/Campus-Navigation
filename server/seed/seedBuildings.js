import dotenv from "dotenv";
import mongoose from "mongoose";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import Building from "../models/Building.js";

dotenv.config();

// SAMPLE DATA ONLY. The names come from the prototype design.
// The latitude/longitude values are placeholders. Replace them with
// real coordinates before the map stage.
const sampleBuildings = [
  {
    name: "Main Library",
    code: "A",
    description: "24/7 study space with extensive resources",
    category: "Library",
    latitude: 17.4,
    longitude: 78.67,
  },
  {
    name: "Lecture Hall Complex",
    code: "B",
    description: "Main lecture theaters and classrooms",
    category: "Academic",
    latitude: 17.4005,
    longitude: 78.6705,
  },
  {
    name: "Student Center",
    code: "C",
    description: "Food court, student services, and lounges",
    category: "Student Services",
    latitude: 17.401,
    longitude: 78.671,
  },
  {
    name: "Dining Hall",
    code: "D",
    description: "Main cafeteria with multiple cuisines",
    category: "Food",
    latitude: 17.4015,
    longitude: 78.6715,
  },
  {
    name: "Science Labs",
    code: "E",
    description: "Physics, Chemistry, and Biology labs",
    category: "Laboratory",
    latitude: 17.402,
    longitude: 78.672,
  },
  {
    name: "Indoor Sports & Games Complex",
    code: "F",
    description: "Badminton, table tennis, chess, carrom, and gym facilities",
    category: "Games",
    latitude: 17.4025,
    longitude: 78.6725,
  },
];

const seed = async () => {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is missing. Add it to server/.env");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
    });
    await Building.deleteMany({}); // remove old data so we do not get duplicates
    const created = await Building.insertMany(sampleBuildings);
    console.log(`Seeded ${created.length} buildings`);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seed();