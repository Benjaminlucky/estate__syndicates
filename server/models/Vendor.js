import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    // =========================
    // BASIC INFO
    // =========================
    name: {
      type: String,
      required: true,
      trim: true,
    },

    vendorType: {
      type: String,
      enum: ["Materials", "Logistics", "Equipment", "Services"],
      required: true,
    },

    contactPerson: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    // =========================
    // LOCATION
    // =========================
    vendorState: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    // =========================
    // BANKING DETAILS
    // =========================
    vendorBank: {
      type: String,
      trim: true,
    },

    accountNumber: {
      type: String,
      trim: true,
    },

    vendorAccountName: {
      type: String,
      trim: true,
    },

    // =========================
    // SYSTEM
    // =========================
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Vendor", vendorSchema);
