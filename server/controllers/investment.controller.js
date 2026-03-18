import Investment from "../models/Investment.js";
import Project from "../models/Project.js";

export const createInvestment = async (req, res) => {
  try {
    const investorId = req.user.id;
    const { projectId, units } = req.body;

    if (!projectId || !units || units < 1) {
      return res
        .status(400)
        .json({ message: "projectId and units are required" });
    }

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.status === "Completed") {
      return res
        .status(400)
        .json({ message: "This project is no longer accepting investments" });
    }

    if (!project.pricePerUnit || project.pricePerUnit <= 0) {
      return res
        .status(400)
        .json({ message: "Project pricing is not configured yet" });
    }

    const amount = Number(units) * Number(project.pricePerUnit);

    const investment = await Investment.create({
      investor: investorId,
      project: projectId,
      units: Number(units),
      amount,
      pricePerUnitAtInvestment: Number(project.pricePerUnit),
      status: "active",
    });

    if (project.totalUnits && project.totalUnits > 0) {
      const allInvestments = await Investment.find({
        project: projectId,
        status: { $in: ["active", "completed"] },
      });
      const totalUnitsSold = allInvestments.reduce(
        (sum, inv) => sum + inv.units,
        0,
      );
      const newPct = Math.min(
        100,
        Math.round((totalUnitsSold / project.totalUnits) * 100),
      );
      await Project.findByIdAndUpdate(projectId, { soldPercentage: newPct });
    }

    await investment.populate("project", "title location image status roi");

    return res
      .status(201)
      .json({ message: "Investment recorded successfully", investment });
  } catch (err) {
    console.error("createInvestment error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getMyInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({ investor: req.user.id })
      .populate(
        "project",
        "title location image status roi irr completionDate developmentType budget pricePerUnit soldPercentage",
      )
      .sort({ createdAt: -1 });
    return res.status(200).json({ investments });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getPortfolioSummary = async (req, res) => {
  try {
    const investments = await Investment.find({
      investor: req.user.id,
      status: { $in: ["active", "completed"] },
    }).populate("project", "title roi status");

    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const projectedReturns = investments.reduce((sum, inv) => {
      const roiPct = parseFloat(inv.project?.roi) || 0;
      return sum + inv.amount * (roiPct / 100);
    }, 0);
    const totalPayouts = investments.reduce((sum, inv) => {
      return sum + inv.payoutHistory.reduce((ps, p) => ps + (p.amount || 0), 0);
    }, 0);

    return res.status(200).json({
      totalInvested,
      projectedReturns,
      projectedValue: totalInvested + projectedReturns,
      totalPayouts,
      activeInvestments: investments.filter((i) => i.status === "active")
        .length,
      completedInvestments: investments.filter((i) => i.status === "completed")
        .length,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const recent = await Investment.find({ investor: req.user.id })
      .populate("project", "title")
      .sort({ createdAt: -1 })
      .limit(10);

    const notifications = recent.map((inv) => ({
      id: inv._id,
      type: "investment",
      message: `You invested ₦${Number(inv.amount).toLocaleString("en-NG")} in ${inv.project?.title}`,
      date: inv.createdAt,
      read: false,
    }));

    return res.status(200).json({ notifications });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
