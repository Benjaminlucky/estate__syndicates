import express from "express";
import {
  createInvestment,
  getMyInvestments,
  getPortfolioSummary,
  getNotifications,
  getProjectAvailability,
} from "../controllers/investment.controller.js";
import {
  verifyAdmin,
  verifyManagerOrAbove,
  verifyToken,
} from "../middlewares/auth.js";
import Investment from "../models/Investment.js";

const router = express.Router();

/* ── Investor routes ─────────────────────────────────────────────
   NOTE: specific paths MUST come before wildcard /:id paths      */
router.post("/", verifyToken, createInvestment);
router.get("/my", verifyToken, getMyInvestments);
router.get("/my/stats", verifyToken, getPortfolioSummary);
router.get("/notifications", verifyToken, getNotifications);
router.get("/project/:projectId/availability", getProjectAvailability); // public

/* ── Admin: list all investments ─────────────────────────────── */
router.get("/", verifyAdmin, async (req, res) => {
  try {
    const investments = await Investment.find()
      .populate("investor", "firstName lastName emailAddress")
      .populate("project", "title status roi pricePerUnit totalUnits")
      .sort({ createdAt: -1 });
    res.json({ success: true, investments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── Admin: approve investment ───────────────────────────────── */
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

/* ── Admin: reject investment ────────────────────────────────── */
router.patch("/:id/reject", verifyManagerOrAbove, async (req, res) => {
  try {
    const inv = await Investment.findByIdAndUpdate(
      req.params.id,
      { status: "refunded" },
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

/* ── Admin: record payout ─────────────────────────────────────── */
router.patch("/:id/payout", verifyManagerOrAbove, async (req, res) => {
  try {
    const { amount, reference, note } = req.body;
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: "Valid amount required" });
    }
    const inv = await Investment.findById(req.params.id);
    if (!inv) return res.status(404).json({ message: "Investment not found" });

    inv.payoutHistory.push({ amount: Number(amount), reference, note });
    const totalPaid = inv.payoutHistory.reduce(
      (s, p) => s + (p.amount || 0),
      0,
    );
    if (totalPaid >= inv.amount) inv.status = "completed";
    await inv.save();

    res.json({ success: true, investment: inv });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
