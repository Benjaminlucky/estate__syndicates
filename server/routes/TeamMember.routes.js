import express from "express";
import {
  createTeamMember,
  getTeamMembers,
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember,
  toggleTeamMemberStatus,
  loginTeamMember,
} from "../controllers/TeamMember.controller.js";

const router = express.Router();

// LOGIN FIRST — prevents /:id collision
router.post("/login", loginTeamMember);

// REST ROUTES
router.post("/", createTeamMember);
router.get("/", getTeamMembers);
router.get("/:id", getTeamMemberById);
router.put("/:id", updateTeamMember);
router.patch("/:id/toggle-status", toggleTeamMemberStatus);
router.delete("/:id", deleteTeamMember);

export default router;
