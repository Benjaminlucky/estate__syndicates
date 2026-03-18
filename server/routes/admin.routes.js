import express from "express";
import {
  adminLogin,
  adminSignup,
  getAdmins,
  updateAdminRole,
  deleteAdmin,
} from "../controllers/admin.controller.js";
import { verifySuperAdmin } from "../middlewares/auth.js";

const router = express.Router();

/* ── Auth (public) ──────────────────────────────────────────────── */
router.post("/signup", adminSignup);
router.post("/login", adminLogin);

/* ── Admin user management (super_admin only) ───────────────────── */
router.get("/admins", verifySuperAdmin, getAdmins);
router.patch("/admins/:id", verifySuperAdmin, updateAdminRole);
router.delete("/admins/:id", verifySuperAdmin, deleteAdmin);

export default router;
