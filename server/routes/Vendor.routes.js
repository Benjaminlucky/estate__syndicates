import express from "express";
import {
  createVendor,
  getVendors,
  updateVendor,
  toggleVendorStatus,
} from "../controllers/Vendor.controller.js";

const router = express.Router();

router.post("/", createVendor);
router.get("/", getVendors);
router.put("/:id", updateVendor);
router.patch("/:id/toggle-status", toggleVendorStatus);

export default router;
