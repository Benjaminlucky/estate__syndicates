import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const teamMemberSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: [
        "Painter",
        "Welder",
        "Engineer",
        "Accountant",
        "Architect",
        "Electrician",
        "Plumber",
        "Project Manager",
      ],
    },
    employmentType: {
      type: String,
      enum: ["Contract", "Full-time", "Part-time"],
      default: "Contract",
    },
    assignedProjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    passwordChangeRequired: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Compare password - Using direct bcrypt.compare instead of instance method
teamMemberSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    console.log("🔍 Comparing entered password with stored hash");
    const result = await bcrypt.compare(enteredPassword, this.password);
    console.log("🔍 Comparison result:", result);
    return result;
  } catch (error) {
    console.error("❌ Password comparison error:", error);
    return false;
  }
};

// Generate JWT
teamMemberSchema.methods.generateToken = function () {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export default mongoose.model("TeamMember", teamMemberSchema);
