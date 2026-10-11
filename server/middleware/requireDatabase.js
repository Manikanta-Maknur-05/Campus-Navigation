import mongoose from "mongoose";

// Stops the request early if MongoDB is not connected
const requireDatabase = (req, res, next) => {
  // 1 = connected. Anything else means MongoDB is not ready.
  if (mongoose.connection.readyState !== 1) {
    return res
      .status(503)
      .json({ message: "Database is not connected. Check MONGODB_URI." });
  }
  next();
};

export default requireDatabase;