import dotenv from "dotenv";
import mongoose from "mongoose";
import dns from "node:dns";
import { fileURLToPath } from "node:url";
import User from "../models/User.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

// Always read server/.env, no matter which folder you run this from
dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

// Usage: node server/seed/makeAdmin.js someone@example.com
const email = String(process.argv[2] || "").trim().toLowerCase();

const makeAdmin = async () => {
  if (!email) {
    console.error("Please give the email of a registered user.");
    console.error("Example: node server/seed/makeAdmin.js you@example.com");
    process.exit(1);
  }

  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is missing. Add it to server/.env");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
    });

    const user = await User.findOne({ email });

    if (!user) {
      console.error(`No user found with email ${email}. Register on the website first.`);
      process.exitCode = 1;
      return;
    }

    user.role = "admin";
    await user.save();
    console.log(`${user.email} is now an admin.`);
  } catch (error) {
    console.error("Failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

makeAdmin();