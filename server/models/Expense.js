// models/Expense.js
import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true, // e.g. "Cement Purchase", "Generator Repair"
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    category: {
      type: String,
      enum: ["Development", "Maintenance", "Operational", "Legal", "Tax"],
      required: true,
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },

    executedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeamMember",
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Paid", "Unpaid", "Partially Paid"],
      default: "Unpaid",
    },

    paymentMethod: {
      type: String,
      enum: ["Bank Transfer", "Cash", "Cheque", "Online"],
    },

    invoiceUrl: {
      type: String, // receipt / invoice upload
    },

    notes: {
      type: String,
      trim: true,
    },

    expenseDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);
