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
} from "../controllers/TeamMember.controller.js";

const router = express.Router();

// ============================================
// AUTHENTICATION ROUTES (Must be first)
// ============================================
router.post("/login", loginTeamMember);
router.post("/change-password", changePassword);

// ============================================
// CRUD ROUTES
// ============================================
router.post("/", createTeamMember);
router.get("/", getTeamMembers);
router.get("/:id", getTeamMemberById);
router.put("/:id", updateTeamMember);
router.patch("/:id/toggle-status", toggleTeamMemberStatus);
router.delete("/:id", deleteTeamMember);

export default router;
