import express from "express";
import {
  createExpense,
  getAllExpenses,
  getProjectExpenses,
  getExpenseSummaryByProject,
  updateExpenseStatus,
  generateInvoicePDF,
} from "../controllers/expense.controller.js";
import uploadInvoice from "../middlewares/uploadInvoice.js";
import { verifyAdmin, verifyToken } from "../middlewares/auth.js";

const router = express.Router();

/* ── Public reads (investor dashboard will call these) ─────────── */
router.get("/", getAllExpenses);
router.get("/project/:projectId", getProjectExpenses);
router.get("/summary/:projectId", getExpenseSummaryByProject);

/* ── Invoice PDF — accessible by both admin and authenticated investor ── */
router.get("/:id/invoice", verifyToken, generateInvoicePDF);

/* ── Admin writes ──────────────────────────────────────────────── */
router.post("/", verifyAdmin, uploadInvoice.single("invoice"), createExpense);
router.patch("/:id/status", verifyAdmin, updateExpenseStatus);

export default router;
