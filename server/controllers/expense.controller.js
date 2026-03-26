import Expense from "../models/Expense.js";
import mongoose from "mongoose";
import PDFDocument from "pdfkit";

/* ─────────────────────────────────────────────────────────────────
   Helpers
─────────────────────────────────────────────────────────────────── */
const fmt = (n) =>
  "₦" + Number(n || 0).toLocaleString("en-NG", { minimumFractionDigits: 2 });

const padId = (id) => String(id).slice(-6).toUpperCase();

/* ─────────────────────────────────────────────────────────────────
   CREATE: Record a new expense
─────────────────────────────────────────────────────────────────── */
export const createExpense = async (req, res) => {
  try {
    const {
      title,
      amount,
      project,
      category,
      vendor,
      paymentStatus,
      paymentMethod,
      amountPaid,
      notes,
    } = req.body;

    const invoiceUrl = req.file ? req.file.path : null;

    /* Resolve amountPaid based on paymentStatus when not explicitly sent */
    let resolvedAmountPaid = Number(amountPaid) || 0;
    if (paymentStatus === "Paid") resolvedAmountPaid = Number(amount);
    if (paymentStatus === "Unpaid") resolvedAmountPaid = 0;

    const newExpense = new Expense({
      title,
      amount: Number(amount),
      amountPaid: resolvedAmountPaid,
      project,
      category,
      vendor: vendor || null,
      paymentStatus,
      paymentMethod,
      notes,
      invoiceUrl,
      executedBy: req.body.executedBy || "657a12345678901234567890",
    });

    const savedExpense = await newExpense.save();
    res.status(201).json({ success: true, expense: savedExpense });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating expense", error: error.message });
  }
};

/* ─────────────────────────────────────────────────────────────────
   READ: Get all expenses
─────────────────────────────────────────────────────────────────── */
export const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find()
      .populate("project", "title")
      .populate(
        "vendor",
        "name vendorBank accountNumber vendorAccountName contactPerson address",
      )
      .populate("executedBy", "fullName role")
      .sort({ createdAt: -1 });
    res.status(200).json({ expenses });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching expenses", error: error.message });
  }
};

/* ─────────────────────────────────────────────────────────────────
   READ: Get expenses for a specific project
─────────────────────────────────────────────────────────────────── */
export const getProjectExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ project: req.params.projectId })
      .populate("vendor", "name vendorBank accountNumber vendorAccountName")
      .populate("executedBy", "fullName role")
      .sort({ createdAt: -1 });
    res.status(200).json({ expenses });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching project expenses",
      error: error.message,
    });
  }
};

/* ─────────────────────────────────────────────────────────────────
   READ: Summary stats for a project
─────────────────────────────────────────────────────────────────── */
export const getExpenseSummaryByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const stats = await Expense.aggregate([
      { $match: { project: new mongoose.Types.ObjectId(projectId) } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          paidAmount: {
            $sum: {
              $cond: [{ $eq: ["$paymentStatus", "Paid"] }, "$amount", 0],
            },
          },
          pendingAmount: {
            $sum: {
              $cond: [{ $ne: ["$paymentStatus", "Paid"] }, "$amount", 0],
            },
          },
        },
      },
    ]);
    res
      .status(200)
      .json(stats[0] || { totalAmount: 0, paidAmount: 0, pendingAmount: 0 });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching summary", error: error.message });
  }
};

/* ─────────────────────────────────────────────────────────────────
   UPDATE: Change payment status (and sync amountPaid)
─────────────────────────────────────────────────────────────────── */
export const updateExpenseStatus = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    const newStatus = req.body.status;
    const update = { paymentStatus: newStatus };

    /* Keep amountPaid in sync when status flips to Paid or Unpaid */
    if (newStatus === "Paid") update.amountPaid = expense.amount;
    if (newStatus === "Unpaid") update.amountPaid = 0;
    /* For "Partially Paid" allow explicit amountPaid in body */
    if (newStatus === "Partially Paid" && req.body.amountPaid !== undefined) {
      update.amountPaid = Number(req.body.amountPaid);
    }

    const updated = await Expense.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

/* ─────────────────────────────────────────────────────────────────
   INVOICE PDF: GET /api/expenses/:id/invoice
   Streams a professional invoice PDF for a single expense record.
   Works for Paid, Partially Paid, and Unpaid expenses.
─────────────────────────────────────────────────────────────────── */
export const generateInvoicePDF = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate("project", "title location")
      .populate(
        "vendor",
        "name contactPerson phone email address vendorBank accountNumber vendorAccountName vendorState",
      )
      .populate("executedBy", "fullName role");

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const outstanding = expense.amount - (expense.amountPaid || 0);
    const invoiceNo = `EST-EXP-${new Date(expense.createdAt).getFullYear()}-${padId(expense._id)}`;
    const issuedDate = new Date(
      expense.expenseDate || expense.createdAt,
    ).toLocaleDateString("en-NG", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    /* ── Colour palette matching the app ───────────────────────── */
    const GOLD = "#B8860B";
    const DARK = "#1A1A2E";
    const MID = "#6B7280";
    const LINE = "#E5E7EB";
    const WHITE = "#FFFFFF";
    const GREEN = "#166534";
    const AMBER = "#92400E";
    const RED = "#991B1B";
    const BGLIGHT = "#F8F4EC";

    const STATUS_COLOR = {
      Paid: GREEN,
      "Partially Paid": AMBER,
      Unpaid: RED,
    };

    /* ── PDF document ───────────────────────────────────────────── */
    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
      info: {
        Title: `Invoice ${invoiceNo}`,
        Author: "Estate Syndicates",
      },
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="invoice-${invoiceNo}.pdf"`,
    );
    doc.pipe(res);

    const pageW = doc.page.width; // 595
    const margin = 50;
    const inner = pageW - margin * 2; // 495

    /* ── HEADER BAND ────────────────────────────────────────────── */
    doc.rect(0, 0, pageW, 90).fill(DARK);

    doc
      .fillColor(GOLD)
      .font("Helvetica-Bold")
      .fontSize(22)
      .text("ESTATE SYNDICATES", margin, 24);

    doc
      .fillColor(WHITE)
      .font("Helvetica")
      .fontSize(9)
      .text("Real Estate Investment & Development", margin, 50)
      .text("estatesindicates.com", margin, 62);

    doc
      .fillColor(WHITE)
      .font("Helvetica-Bold")
      .fontSize(26)
      .text("INVOICE", pageW - margin - 120, 28, {
        width: 120,
        align: "right",
      });

    doc.fillColor(DARK).rect(0, 90, pageW, 3).fill(GOLD);

    /* ── INVOICE META ROW ───────────────────────────────────────── */
    doc.moveDown(1.8);
    const metaY = 112;

    doc
      .fillColor(MID)
      .font("Helvetica")
      .fontSize(8)
      .text("INVOICE NUMBER", margin, metaY);
    doc
      .fillColor(DARK)
      .font("Helvetica-Bold")
      .fontSize(11)
      .text(invoiceNo, margin, metaY + 12);

    doc
      .fillColor(MID)
      .font("Helvetica")
      .fontSize(8)
      .text("ISSUE DATE", margin + 200, metaY);
    doc
      .fillColor(DARK)
      .font("Helvetica-Bold")
      .fontSize(11)
      .text(issuedDate, margin + 200, metaY + 12);

    /* Payment status stamp */
    const stampColor = STATUS_COLOR[expense.paymentStatus] || MID;
    const stampX = pageW - margin - 130;
    doc.rect(stampX, metaY - 4, 130, 36).fill(stampColor);
    doc
      .fillColor(WHITE)
      .font("Helvetica-Bold")
      .fontSize(13)
      .text(expense.paymentStatus.toUpperCase(), stampX, metaY + 6, {
        width: 130,
        align: "center",
      });

    /* ── DIVIDER ────────────────────────────────────────────────── */
    const div = (y) => doc.rect(margin, y, inner, 1).fill(LINE);
    div(160);

    /* ── PROJECT & EXPENSE INFO ─────────────────────────────────── */
    let y = 170;
    const colW = inner / 2;

    const field = (label, value, cx, cy) => {
      doc.fillColor(MID).font("Helvetica").fontSize(8).text(label, cx, cy);
      doc
        .fillColor(DARK)
        .font("Helvetica-Bold")
        .fontSize(10)
        .text(value || "—", cx, cy + 12, { width: colW - 10 });
    };

    field("PROJECT", expense.project?.title ?? "N/A", margin, y);
    field("LOCATION", expense.project?.location ?? "—", margin + colW, y);
    y += 46;
    field("EXPENSE TITLE", expense.title, margin, y);
    field("CATEGORY", expense.category, margin + colW, y);
    y += 46;
    field("EXPENSE DATE", issuedDate, margin, y);
    field("PAYMENT METHOD", expense.paymentMethod ?? "—", margin + colW, y);
    y += 46;

    div(y);
    y += 12;

    /* ── VENDOR BLOCK (only if linked) ──────────────────────────── */
    if (expense.vendor) {
      const v = expense.vendor;

      doc
        .fillColor(GOLD)
        .font("Helvetica-Bold")
        .fontSize(9)
        .text("PAYEE / VENDOR DETAILS", margin, y);
      y += 18;

      doc.rect(margin, y, inner, 70).fill(BGLIGHT);

      field("VENDOR NAME", v.name ?? "—", margin + 8, y + 6);
      field("CONTACT PERSON", v.contactPerson ?? "—", margin + colW, y + 6);
      y += 36;
      field(
        "ADDRESS",
        [v.address, v.vendorState].filter(Boolean).join(", ") || "—",
        margin + 8,
        y - 4,
      );

      /* Banking details */
      const bankDetails = [v.vendorBank, v.accountNumber, v.vendorAccountName]
        .filter(Boolean)
        .join("  ·  ");
      field("BANK ACCOUNT", bankDetails || "—", margin + colW, y - 4);

      y += 36;
      div(y);
      y += 12;
    }

    /* ── FINANCIAL SUMMARY TABLE ─────────────────────────────────── */
    doc
      .fillColor(GOLD)
      .font("Helvetica-Bold")
      .fontSize(9)
      .text("FINANCIAL SUMMARY", margin, y);
    y += 16;

    const tableRow = (label, value, bg, textColor = DARK, bold = false) => {
      doc.rect(margin, y, inner, 26).fill(bg);
      doc
        .fillColor(MID)
        .font("Helvetica")
        .fontSize(9)
        .text(label, margin + 10, y + 8);
      doc
        .fillColor(textColor)
        .font(bold ? "Helvetica-Bold" : "Helvetica")
        .fontSize(10)
        .text(value, margin, y + 8, { width: inner - 10, align: "right" });
      y += 26;
    };

    tableRow("Total Amount", fmt(expense.amount), "#F9FAFB");
    if (expense.paymentStatus !== "Unpaid") {
      tableRow("Amount Paid", fmt(expense.amountPaid), "#F0FDF4", GREEN);
    }
    if (
      expense.paymentStatus === "Partially Paid" ||
      expense.paymentStatus === "Unpaid"
    ) {
      tableRow(
        "Outstanding Balance",
        fmt(outstanding),
        expense.paymentStatus === "Unpaid" ? "#FFF1F2" : "#FFFBEB",
        expense.paymentStatus === "Unpaid" ? RED : AMBER,
        true,
      );
    }
    /* Bold totals row */
    tableRow(
      expense.paymentStatus === "Paid"
        ? "TOTAL SETTLED"
        : "TOTAL INVOICE AMOUNT",
      fmt(expense.amount),
      DARK,
      GOLD,
      true,
    );

    y += 10;
    div(y);
    y += 16;

    /* ── EXECUTED BY & NOTES ────────────────────────────────────── */
    if (expense.executedBy?.fullName) {
      doc
        .fillColor(MID)
        .font("Helvetica")
        .fontSize(8)
        .text("RECORDED BY", margin, y);
      doc
        .fillColor(DARK)
        .font("Helvetica-Bold")
        .fontSize(10)
        .text(
          `${expense.executedBy.fullName}${expense.executedBy.role ? " · " + expense.executedBy.role : ""}`,
          margin,
          y + 12,
        );
      y += 38;
    }

    if (expense.notes) {
      doc.fillColor(MID).font("Helvetica").fontSize(8).text("NOTES", margin, y);
      doc
        .fillColor(DARK)
        .font("Helvetica")
        .fontSize(9)
        .text(expense.notes, margin, y + 12, { width: inner });
      y += 30 + Math.ceil(expense.notes.length / 80) * 12;
    }

    /* ── FOOTER BAND ────────────────────────────────────────────── */
    const footerY = doc.page.height - 60;
    doc.rect(0, footerY, pageW, 60).fill(DARK);
    doc
      .fillColor(MID)
      .font("Helvetica")
      .fontSize(8)
      .text(
        "This document is generated by Estate Syndicates and is for internal and investor use only.",
        margin,
        footerY + 14,
        { width: inner, align: "center" },
      );
    doc
      .fillColor(GOLD)
      .fontSize(8)
      .text("estatesindicates.com", margin, footerY + 30, {
        width: inner,
        align: "center",
      });

    doc.end();
  } catch (error) {
    console.error("Invoice PDF error:", error);
    if (!res.headersSent) {
      res
        .status(500)
        .json({ message: "Failed to generate invoice", error: error.message });
    }
  }
};
