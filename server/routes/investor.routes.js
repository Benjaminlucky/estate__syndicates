import express from "express";
import {
  createInvestor,
  loginInvestor,
} from "../controllers/investor.controller.js";

const router = express.Router();

router.post("/signup", createInvestor);
router.post("/login", loginInvestor);

export default router;
