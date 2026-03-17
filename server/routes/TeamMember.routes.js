import express from "express";
import {
  createTeamMember,
  getTeamMembers,
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember,
  toggleTeamMemberStatus,
  loginTeamMember,
  changePassword,
  resetPassword,
} from "../controllers/TeamMember.controller.js";
import { verifyAdmin, verifyTeamMember } from "../middlewares/auth.js";

const router = express.Router();

// ── Public auth (no token needed to log in or change password) ────
router.post("/login", loginTeamMember);
router.post("/change-password", verifyTeamMember, changePassword);

// ── Admin-only CRUD ───────────────────────────────────────────────
router.post("/", verifyAdmin, createTeamMember);
router.get("/", verifyAdmin, getTeamMembers);
router.get("/:id", verifyAdmin, getTeamMemberById);
router.put("/:id", verifyAdmin, updateTeamMember);
router.patch("/:id/toggle-status", verifyAdmin, toggleTeamMemberStatus);
router.delete("/:id", verifyAdmin, deleteTeamMember);

// ── Admin: reset a team member's password ────────────────────────
router.post("/reset-password/:memberId", verifyAdmin, resetPassword);

export default router;
