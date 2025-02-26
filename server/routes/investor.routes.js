import express from "express";
import { createInvestor } from "../controllers/investor.controller.js";

const router = express.Router();

router.post("/signup", createInvestor);

export default router;
