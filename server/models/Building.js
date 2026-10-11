import mongoose from "mongoose";

// A Building is one place on the campus (library, lab, canteen, etc.)
const buildingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category: {
      type: String,
      enum: ["Library", "Academic", "Laboratory", "Food", "Student Services", "Games"],
      required: true,
    },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { timestamps: true }
);

const Building = mongoose.model("Building", buildingSchema);

export default Building;