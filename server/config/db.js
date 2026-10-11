import mongoose from "mongoose";
import dns from "node:dns";

// Connects to MongoDB using the MONGODB_URI value from server/.env
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("MONGODB_URI is missing. Add it to server/.env");
    return;
  }

  // Local-only fix for networks whose DNS cannot look up MongoDB Atlas addresses.
  // On the hosting platform (NODE_ENV=production) the normal DNS is used.
  if (process.env.NODE_ENV !== "production") {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
};

export default connectDB;