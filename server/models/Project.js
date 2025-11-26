// models/Project.js
import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    developmentType: { type: String, trim: true },
    totalUnits: { type: Number },
    pricePerUnit: { type: Number },
    budget: { type: String }, // or Number if you store raw NUMBER
    soldPercentage: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Coming Soon", "Active", "Completed"],
      default: "Coming Soon",
    },
    roi: { type: String },
    irr: { type: String },
    completionDate: { type: Date },
    shortDescription: { type: String },
    image: {
      type: String,
      required: false,
      trim: true,
    },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", ProjectSchema);

export default Project;
