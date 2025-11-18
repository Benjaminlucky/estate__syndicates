import Project from "../models/Project.js";

// CREATE
export const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    return res.status(201).json({ success: true, project });
  } catch (err) {
    console.error("CREATE ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET ALL
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, projects });
  } catch (err) {
    console.error("GET ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET ONE
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    return res.status(200).json({ success: true, project });
  } catch (err) {
    console.error("GET ONE ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    return res.status(200).json({ success: true, project });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE
export const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: "Deleted" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
5;
