import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const investorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true, // Ensure phone numbers are unique
      trim: true,
    },
    emailAddress: {
      type: String,
      required: true,
      unique: true, // Ensure unique emails
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"], // Email validation
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Enforce minimum password length
    },
  },
  {
    timestamps: true,
  }
);

// 🔐 **Middleware: Hash Password Before Saving**
investorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash if password is modified

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model("Investor", investorSchema);
