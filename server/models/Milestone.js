import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      /* e.g. "Foundation Complete", "Roofing", "Final Inspection" */
    },
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "delayed"],
      default: "pending",
    },
    targetDate: { type: Date },
    completedDate: { type: Date },
    progressPct: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    /* Photo / document evidence */
    attachments: [
      {
        url: { type: String },
        label: { type: String },
      },
    ],
    loggedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Milestone", milestoneSchema);
