import express from "express";
import {
  createExpense,
  getAllExpenses, // New import
  getProjectExpenses,
  getExpenseSummaryByProject,
  updateExpenseStatus,
} from "../controllers/expense.controller.js";
import uploadInvoice from "../middlewares/uploadInvoice.js";

const router = express.Router();

// Integrated upload middleware for invoices
router.post("/", uploadInvoice.single("invoice"), createExpense);

// GLOBAL GET: This fixes the 404 error on the main expenses page
router.get("/", getAllExpenses);

router.get("/project/:projectId", getProjectExpenses);
router.get("/summary/:projectId", getExpenseSummaryByProject);
router.patch("/:id/status", updateExpenseStatus);

export default router;
