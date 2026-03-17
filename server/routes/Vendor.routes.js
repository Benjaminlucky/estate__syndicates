import express from "express";
import {
  createVendor,
  getVendors,
  updateVendor,
  toggleVendorStatus,
} from "../controllers/Vendor.controller.js";
import { verifyAdmin } from "../middlewares/auth.js";

const router = express.Router();

// ── Public read ───────────────────────────────────────────────────
router.get("/", getVendors);

// ── Admin writes ──────────────────────────────────────────────────
router.post("/", verifyAdmin, createVendor);
router.put("/:id", verifyAdmin, updateVendor);
router.patch("/:id/toggle-status", verifyAdmin, toggleVendorStatus);

export default router;
