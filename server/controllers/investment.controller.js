import Investment from "../models/Investment.js";
import Project from "../models/Project.js";

/* ─── helpers ──────────────────────────────────────────────────── */

/**
 * Count how many units of a project are already sold/committed
 * across all active + completed investments.
 */
const getUnitsSold = async (projectId) => {
  const result = await Investment.aggregate([
    {
      $match: {
        project: projectId,
        status: { $in: ["pending", "active", "completed"] },
      },
    },
    { $group: { _id: null, total: { $sum: "$units" } } },
  ]);
  return result[0]?.total ?? 0;
};

/**
 * Recalculate and persist soldPercentage on the project document.
 */
const syncSoldPercentage = async (projectId) => {
  const project = await Project.findById(projectId);
  if (!project || !project.totalUnits || project.totalUnits <= 0) return;
  const unitsSold = await getUnitsSold(project._id);
  const pct = Math.min(100, Math.round((unitsSold / project.totalUnits) * 100));
  await Project.findByIdAndUpdate(projectId, { soldPercentage: pct });
};

/**
 * Duration-aware projected ROI.
 * If project has a completionDate we pro-rate the annual ROI by months remaining.
 * Falls back to full annual ROI if no completionDate.
 */
const calcProjectedReturn = (amount, project, investedAt) => {
  const annualRoiPct = parseFloat(project?.roi) || 0;
  if (annualRoiPct <= 0) return 0;

  if (project.completionDate) {
    const now = new Date(investedAt || Date.now());
    const end = new Date(project.completionDate);
    const msLeft = end - now;
    if (msLeft <= 0) return 0;
    const monthsLeft = msLeft / (1000 * 60 * 60 * 24 * 30.44);
    return amount * (annualRoiPct / 100) * (monthsLeft / 12);
  }
  return amount * (annualRoiPct / 100);
};

/* ════════════════════════════════════════════════════════════════
   POST /api/investments
   Body: { projectId, units, paymentReference?, notes? }
   Auth: verifyToken (investor)
════════════════════════════════════════════════════════════════ */
export const createInvestment = async (req, res) => {
  try {
    const investorId = req.user.id;
    const { projectId, units, paymentReference = "", notes = "" } = req.body;

    if (!projectId || !units || Number(units) < 1) {
      return res.status(400).json({
        success: false,
        message: "projectId and units (≥1) are required",
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    if (project.status === "Completed") {
      return res.status(400).json({
        success: false,
        message: "This project is no longer accepting investments",
      });
    }

    if (!project.pricePerUnit || Number(project.pricePerUnit) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Project pricing is not configured yet — contact the admin",
      });
    }

    /* ── unit-availability check ────────────────────────────────── */
    if (project.totalUnits && project.totalUnits > 0) {
      const alreadySold = await getUnitsSold(project._id);
      const availableUnits = project.totalUnits - alreadySold;

      if (Number(units) > availableUnits) {
        return res.status(400).json({
          success: false,
          message: `Only ${availableUnits} unit${availableUnits !== 1 ? "s" : ""} available in this project`,
          availableUnits,
        });
      }
    }

    const amount = Number(units) * Number(project.pricePerUnit);

    const investment = await Investment.create({
      investor: investorId,
      project: projectId,
      units: Number(units),
      amount,
      pricePerUnitAtInvestment: Number(project.pricePerUnit),
      paymentReference,
      notes,
      status: "active",
    });

    /* recalculate soldPercentage */
    await syncSoldPercentage(projectId);

    await investment.populate(
      "project",
      "title location image status roi irr completionDate pricePerUnit totalUnits soldPercentage",
    );

    return res.status(201).json({
      success: true,
      message: "Investment recorded successfully",
      investment,
    });
  } catch (err) {
    console.error("createInvestment error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ════════════════════════════════════════════════════════════════
   GET /api/investments/my
════════════════════════════════════════════════════════════════ */
export const getMyInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({ investor: req.user.id })
      .populate(
        "project",
        "title location image status roi irr completionDate developmentType pricePerUnit totalUnits soldPercentage budget",
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, investments });
  } catch (err) {
    console.error("getMyInvestments error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ════════════════════════════════════════════════════════════════
   GET /api/investments/my/stats   (portfolio summary)
════════════════════════════════════════════════════════════════ */
export const getPortfolioSummary = async (req, res) => {
  try {
    const investments = await Investment.find({
      investor: req.user.id,
      status: { $in: ["active", "completed"] },
    }).populate("project", "title roi irr status completionDate");

    const totalInvested = investments.reduce((s, inv) => s + inv.amount, 0);

    const projectedReturns = investments.reduce((s, inv) => {
      return s + calcProjectedReturn(inv.amount, inv.project, inv.createdAt);
    }, 0);

    const totalPayouts = investments.reduce((s, inv) => {
      return s + inv.payoutHistory.reduce((ps, p) => ps + (p.amount || 0), 0);
    }, 0);

    const breakdown = investments.map((inv) => {
      const projected = calcProjectedReturn(
        inv.amount,
        inv.project,
        inv.createdAt,
      );
      return {
        investmentId: inv._id,
        projectTitle: inv.project?.title,
        amount: inv.amount,
        units: inv.units,
        status: inv.status,
        projectedReturn: projected,
        roiPercent:
          inv.amount > 0
            ? parseFloat(((projected / inv.amount) * 100).toFixed(2))
            : 0,
        payoutsReceived: inv.payoutHistory.reduce(
          (s, p) => s + (p.amount || 0),
          0,
        ),
        investedAt: inv.createdAt,
      };
    });

    return res.status(200).json({
      success: true,
      totalInvested,
      projectedReturns,
      projectedValue: totalInvested + projectedReturns,
      totalPayouts,
      activeInvestments: investments.filter((i) => i.status === "active")
        .length,
      completedInvestments: investments.filter((i) => i.status === "completed")
        .length,
      breakdown,
    });
  } catch (err) {
    console.error("getPortfolioSummary error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ════════════════════════════════════════════════════════════════
   GET /api/investments/notifications
════════════════════════════════════════════════════════════════ */
export const getNotifications = async (req, res) => {
  try {
    const recent = await Investment.find({ investor: req.user.id })
      .populate("project", "title")
      .sort({ createdAt: -1 })
      .limit(10);

    const notifications = recent.map((inv) => ({
      id: inv._id,
      type: "investment",
      message: `You invested ₦${Number(inv.amount).toLocaleString("en-NG")} in ${inv.project?.title ?? "a project"}`,
      date: inv.createdAt,
      read: false,
    }));

    return res.status(200).json({ success: true, notifications });
  } catch (err) {
    console.error("getNotifications error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ════════════════════════════════════════════════════════════════
   GET /api/investments/project/:projectId/availability
   Public — lets the invest modal show live unit availability.
════════════════════════════════════════════════════════════════ */
export const getProjectAvailability = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    const unitsSold = await getUnitsSold(project._id);
    const availableUnits = Math.max(0, (project.totalUnits || 0) - unitsSold);
    const soldPercentage =
      project.totalUnits > 0
        ? Math.min(100, Math.round((unitsSold / project.totalUnits) * 100))
        : 0;

    return res.status(200).json({
      success: true,
      totalUnits: project.totalUnits || 0,
      unitsSold,
      availableUnits,
      soldPercentage,
      pricePerUnit: project.pricePerUnit || 0,
      status: project.status,
    });
  } catch (err) {
    console.error("getProjectAvailability error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
