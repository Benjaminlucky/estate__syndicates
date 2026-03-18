import express from "express";
import {
  createInvestment,
  getMyInvestments,
  getPortfolioSummary,
  getNotifications,
} from "../controllers/investment.controller.js";

import Investment from "../models/Investment.js";
import { verifyAdmin, verifyManagerOrAbove, verifyToken } from "../middlewares/auth.js";

const router = express.Router();

/* ── Investor routes ────────────────────────────────────────────── */
router.post("/", verifyToken, createInvestment);
router.get("/my", verifyToken, getMyInvestments);
router.get("/my/stats", verifyToken, getPortfolioSummary);
router.get("/notifications", verifyToken, getNotifications);

/* ── Admin: get all investments ─────────────────────────────────── */
router.get("/", verifyAdmin, async (req, res) => {
  try {
    const investments = await Investment.find()
      .populate("investor", "firstName lastName emailAddress")
      .populate("project", "title status roi")
      .sort({ createdAt: -1 });
    res.json({ success: true, investments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── Admin: approve investment (pending → active) ───────────────── */
router.patch("/:id/approve", verifyManagerOrAbove, async (req, res) => {
  try {
    const inv = await Investment.findByIdAndUpdate(
      req.params.id,
      { status: "active" },
      { new: true },
    )
      .populate("investor", "firstName lastName emailAddress")
      .populate("project", "title");
    if (!inv) return res.status(404).json({ message: "Investment not found" });
    res.json({ success: true, investment: inv });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── Admin: reject / cancel investment ──────────────────────────── */
router.patch("/:id/reject", verifyManagerOrAbove, async (req, res) => {
  try {
    const inv = await Investment.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true },
    )
      .populate("investor", "firstName lastName emailAddress")
      .populate("project", "title");
    if (!inv) return res.status(404).json({ message: "Investment not found" });
    res.json({ success: true, investment: inv });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── Admin: record payout ───────────────────────────────────────── */
router.patch("/:id/payout", verifyManagerOrAbove, async (req, res) => {
  try {
    const { amount, reference, note } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Valid amount required" });
    }
    const inv = await Investment.findById(req.params.id);
    if (!inv) return res.status(404).json({ message: "Investment not found" });

    inv.payoutHistory.push({ amount: Number(amount), reference, note });
    inv.totalPaidOut = (inv.totalPaidOut || 0) + Number(amount);
    if (inv.totalPaidOut >= inv.amount) inv.status = "completed";
    await inv.save();

    res.json({ success: true, investment: inv });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
