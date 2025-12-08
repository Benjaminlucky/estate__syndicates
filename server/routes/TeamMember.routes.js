import express from "express";
import {
  createTeamMember,
  deleteTeamMember,
  getTeamMemberById,
  getTeamMembers,
  loginTeamMember,
  toggleTeamMemberStatus,
  updateTeamMember,
} from "../controllers/Teammember.controller.js";

const router = express.Router();

// Team Member Routes
router.post("/", createTeamMember); // Create
router.get("/", getTeamMembers); // Get all
router.get("/:id", getTeamMemberById); // Get one
router.put("/:id", updateTeamMember); // Update
router.patch("/:id/toggle-status", toggleTeamMemberStatus); // Toggle active status
router.delete("/:id", deleteTeamMember); // Delete
router.post("/team/login", loginTeamMember);

export default router;
