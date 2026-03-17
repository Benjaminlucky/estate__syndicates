import { Router } from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/Projects.controller.js";
import upload from "../middlewares/upload.js";
import { verifyAdmin } from "../middlewares/auth.js";

const router = Router();

// ── Public reads ──────────────────────────────────────────────────
// Investors and public visitors need to see projects without a token.
router.get("/", getProjects);
router.get("/:id", getProjectById);

// ── Admin writes — token required ─────────────────────────────────
// verifyAdmin checks that the token carries an `email` field,
// which only admin-issued tokens contain.
router.post("/", verifyAdmin, upload.single("image"), createProject);
router.put("/:id", verifyAdmin, updateProject);
router.delete("/:id", verifyAdmin, deleteProject);

export default router;
