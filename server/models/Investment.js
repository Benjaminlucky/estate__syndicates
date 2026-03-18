import mongoose from "mongoose";

const investmentSchema = new mongoose.Schema(
  {
    investor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Investor",
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    units: {
      type: Number,
      required: true,
      min: 1,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    pricePerUnitAtInvestment: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "active", "completed", "refunded"],
      default: "active",
    },
    paymentReference: {
      type: String,
      default: "",
    },
    payoutHistory: [
      {
        amount: Number,
        date: { type: Date, default: Date.now },
        reference: String,
        note: String,
      },
    ],
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

investmentSchema.index({ investor: 1, project: 1 });

export default mongoose.model("Investment", investmentSchema);
