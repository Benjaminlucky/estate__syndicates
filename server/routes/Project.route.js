import { Router } from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/Projects.controller.js";
import upload from "../middlewares/upload.js";

const router = Router();

// RESTful routes
router.post("/", upload.single("image"), createProject); // Create
router.get("/", getProjects); // Read all
router.get("/:id", getProjectById); // Read one
router.put("/:id", updateProject); // Update
router.delete("/:id", deleteProject); // Delete

export default router;
