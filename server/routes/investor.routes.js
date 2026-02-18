// server/routes/investor.routes.js
import express from "express";
import {
  createInvestor,
  loginInvestor,
  forgotPassword,
  resetPassword,
} from "../controllers/investor.controller.js";

const router = express.Router();

router.post("/signup", createInvestor);
router.post("/login", loginInvestor);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
