import mongoose from "mongoose";

// A Path is a walkable connection between two buildings. It works in both directions.
// "points" are optional bend points [latitude, longitude] between the two buildings,
// so the path can follow the real walkway instead of a straight line.
// The length is calculated from the coordinates, so it is always up to date.
const pathSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: "Building", required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "Building", required: true },
    points: { type: [[Number]], default: [] },
  },
  { timestamps: true }
);

pathSchema.index({ from: 1, to: 1 }, { unique: true });

const Path = mongoose.model("Path", pathSchema);

export default Path;