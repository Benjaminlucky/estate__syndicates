// routes/Project.route.js
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

router.post("/projects", upload.single("image"), createProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
