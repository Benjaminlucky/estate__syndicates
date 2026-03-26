import express from "express";
import Milestone from "../models/Milestone.js";
import Project from "../models/Project.js";
import { verifyAdmin, verifyManagerOrAbove } from "../middlewares/auth.js";

const router = express.Router();

/* ─────────────────────────────────────────────────────────────────
   GET /api/milestones?projectId=xxx
   Returns all milestones, sorted by phaseStart → targetDate → createdAt
─────────────────────────────────────────────────────────────────── */
router.get("/", verifyAdmin, async (req, res) => {
  try {
    const filter = req.query.projectId ? { project: req.query.projectId } : {};
    const milestones = await Milestone.find(filter)
      .populate("project", "title")
      .populate("loggedBy", "firstName lastName")
      .sort({ phaseStart: 1, targetDate: 1, createdAt: 1 });
    res.json({ success: true, milestones });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ─────────────────────────────────────────────────────────────────
   POST /api/milestones
   Accepts phaseStart, phaseEnd, phaseLabel (all optional).
   phaseLabel is auto-generated on the model pre-save hook if absent.
─────────────────────────────────────────────────────────────────── */
router.post("/", verifyManagerOrAbove, async (req, res) => {
  try {
    const {
      projectId,
      title,
      description,
      targetDate,
      status,
      progressPct,
      phaseStart,
      phaseEnd,
      phaseLabel,
    } = req.body;

    if (!projectId || !title) {
      return res.status(400).json({ message: "projectId and title required" });
    }

    /* Validate phase range */
    if (phaseStart && phaseEnd && Number(phaseEnd) < Number(phaseStart)) {
      return res.status(400).json({
        message: "phaseEnd must be greater than or equal to phaseStart",
      });
    }

    const milestone = await Milestone.create({
      project: projectId,
      title,
      description,
      targetDate,
      status: status ?? "pending",
      progressPct: progressPct ?? 0,
      phaseStart: phaseStart ? Number(phaseStart) : undefined,
      phaseEnd: phaseEnd ? Number(phaseEnd) : undefined,
      phaseLabel: phaseLabel || undefined, // pre-save hook fills it in if absent
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

/* ─────────────────────────────────────────────────────────────────
   PATCH /api/milestones/:id
   Accepts all existing fields + phaseStart, phaseEnd, phaseLabel.
─────────────────────────────────────────────────────────────────── */
router.patch("/:id", verifyManagerOrAbove, async (req, res) => {
  try {
    const {
      status,
      progressPct,
      completedDate,
      description,
      title,
      targetDate,
      phaseStart,
      phaseEnd,
      phaseLabel,
    } = req.body;

    /* Validate phase range */
    if (phaseStart && phaseEnd && Number(phaseEnd) < Number(phaseStart)) {
      return res.status(400).json({
        message: "phaseEnd must be greater than or equal to phaseStart",
      });
    }

    const update = {
      status,
      progressPct,
      description,
      title,
      targetDate,
    };

    /* Only set phase fields when explicitly provided */
    if (phaseStart !== undefined)
      update.phaseStart = phaseStart ? Number(phaseStart) : null;
    if (phaseEnd !== undefined)
      update.phaseEnd = phaseEnd ? Number(phaseEnd) : null;

    /* Resolve phaseLabel: use explicit value, auto-generate, or clear */
    if (phaseLabel !== undefined) {
      update.phaseLabel = phaseLabel || null;
    } else if (update.phaseStart && update.phaseEnd && !phaseLabel) {
      update.phaseLabel = `Month ${update.phaseStart} – ${update.phaseEnd}`;
    }

    if (status === "completed" && !completedDate) {
      update.completedDate = new Date();
    }

    /* Strip undefined keys so we don't accidentally nullify untouched fields */
    Object.keys(update).forEach(
      (k) => update[k] === undefined && delete update[k],
    );

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

/* ─────────────────────────────────────────────────────────────────
   DELETE /api/milestones/:id
─────────────────────────────────────────────────────────────────── */
router.delete("/:id", verifyManagerOrAbove, async (req, res) => {
  try {
    await Milestone.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
