import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },

    /* ── Role-based access control ──────────────────────────────
       super_admin : full access — create/delete admins, all actions
       manager     : manage projects, approve investments, record payouts, team
       viewer      : read-only across all sections
    ────────────────────────────────────────────────────────── */
    role: {
      type: String,
      enum: ["super_admin", "manager", "viewer"],
      default: "super_admin", // first admin created gets full access
    },
  },
  { timestamps: true },
);

export default mongoose.model("Admin", adminSchema);
