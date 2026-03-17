import express from "express";
import {
  createExpense,
  getAllExpenses,
  getProjectExpenses,
  getExpenseSummaryByProject,
  updateExpenseStatus,
} from "../controllers/expense.controller.js";
import uploadInvoice from "../middlewares/uploadInvoice.js";
import { verifyAdmin } from "../middlewares/auth.js";

const router = express.Router();

// ── Public reads (investor dashboard will call these) ─────────────
router.get("/", getAllExpenses);
router.get("/project/:projectId", getProjectExpenses);
router.get("/summary/:projectId", getExpenseSummaryByProject);

// ── Admin writes ──────────────────────────────────────────────────
router.post("/", verifyAdmin, uploadInvoice.single("invoice"), createExpense);
router.patch("/:id/status", verifyAdmin, updateExpenseStatus);

export default router;
