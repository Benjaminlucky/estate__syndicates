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

    /* ── Phase / Period fields ──────────────────────────────────────
       Enables "Month 1 – 3: Piling", "Month 4 – 7: Foundation" etc.
       Both optional — existing milestones without phases display fine.
    ─────────────────────────────────────────────────────────────── */
    phaseStart: {
      type: Number,
      min: 1,
    },
    phaseEnd: {
      type: Number,
      min: 1,
    },
    /* Auto-generated as "Month {phaseStart} – {phaseEnd}" on save
       if phaseStart/phaseEnd are set and phaseLabel is not provided. */
    phaseLabel: {
      type: String,
      trim: true,
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

/* ── Pre-save: auto-generate phaseLabel if not explicitly set ── */
milestoneSchema.pre("save", function (next) {
  if (this.phaseStart && this.phaseEnd && !this.phaseLabel) {
    this.phaseLabel = `Month ${this.phaseStart} – ${this.phaseEnd}`;
  }
  next();
});

/* ── Pre-findOneAndUpdate: same auto-generation for PATCH calls ── */
milestoneSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  const set = update?.$set ?? update ?? {};
  if (set.phaseStart && set.phaseEnd && !set.phaseLabel) {
    if (update.$set) {
      update.$set.phaseLabel = `Month ${set.phaseStart} – ${set.phaseEnd}`;
    } else {
      update.phaseLabel = `Month ${set.phaseStart} – ${set.phaseEnd}`;
    }
  }
  next();
});

export default mongoose.model("Milestone", milestoneSchema);
