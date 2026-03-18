import express from "express";
import Milestone from "../models/Milestone.js";
import Project from "../models/Project.js";
import { verifyAdmin, verifyManagerOrAbove } from "../middlewares/auth.js";

const router = express.Router();

/* GET /api/milestones?projectId=xxx */
router.get("/", verifyAdmin, async (req, res) => {
  try {
    const filter = req.query.projectId ? { project: req.query.projectId } : {};
    const milestones = await Milestone.find(filter)
      .populate("project", "title")
      .populate("loggedBy", "firstName lastName")
      .sort({ targetDate: 1, createdAt: 1 });
    res.json({ success: true, milestones });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* POST /api/milestones */
router.post("/", verifyManagerOrAbove, async (req, res) => {
  try {
    const { projectId, title, description, targetDate, status, progressPct } =
      req.body;
    if (!projectId || !title) {
      return res.status(400).json({ message: "projectId and title required" });
    }
    const milestone = await Milestone.create({
      project: projectId,
      title,
      description,
      targetDate,
      status: status ?? "pending",
      progressPct: progressPct ?? 0,
      loggedBy: req.user.id,
    });
    const populated = await Milestone.findById(milestone._id)
      .populate("project", "title")
      .populate("loggedBy", "firstName lastName");
    res.status(201).json({ success: true, milestone: populated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* PATCH /api/milestones/:id */
router.patch("/:id", verifyManagerOrAbove, async (req, res) => {
  try {
    const { status, progressPct, completedDate, description } = req.body;
    const update = { status, progressPct, description };
    if (status === "completed" && !req.body.completedDate) {
      update.completedDate = new Date();
    }
    const milestone = await Milestone.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true },
    )
      .populate("project", "title")
      .populate("loggedBy", "firstName lastName");
    if (!milestone) return res.status(404).json({ message: "Not found" });

    /* Auto-update project soldPercentage based on avg milestone progress */
    const all = await Milestone.find({ project: milestone.project });
    if (all.length > 0) {
      const avg = Math.round(
        all.reduce((s, m) => s + m.progressPct, 0) / all.length,
      );
      await Project.findByIdAndUpdate(milestone.project, {
        soldPercentage: avg,
      });
    }

    res.json({ success: true, milestone });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* DELETE /api/milestones/:id */
router.delete("/:id", verifyManagerOrAbove, async (req, res) => {
  try {
    await Milestone.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
