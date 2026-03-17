import express from "express";
import {
  createInvestor,
  loginInvestor,
  forgotPassword,
  resetPassword,
} from "../controllers/investor.controller.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

// ── Public — no token needed ──────────────────────────────────────
router.post("/signup", createInvestor);
router.post("/login", loginInvestor);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// ── Protected — token required ────────────────────────────────────
// Add investor-specific protected routes here as you build them.
// Example (uncomment when you build the portfolio endpoint):
// router.get("/me", verifyToken, getInvestorProfile);
// router.get("/investments", verifyToken, getMyInvestments);

export default router;
