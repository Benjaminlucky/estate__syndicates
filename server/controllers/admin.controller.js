import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import adminModel from "../models/admin.model.js";

/* ─── SIGNUP ────────────────────────────────────────────────────── */
export const adminSignup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword, role } =
      req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existing = await adminModel.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    /*
      Only a super_admin can create other admins with specific roles.
      Public signup always creates a super_admin (for initial setup only —
      lock this route down in production after first admin is created).
    */
    const newAdmin = await adminModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role ?? "super_admin",
    });

    res.status(201).json({ message: "Admin account created successfully" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ─── LOGIN ─────────────────────────────────────────────────────── */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    /* Include role in JWT so frontend can gate UI without an extra request */
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" },
    );

    res.json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ─── GET ALL ADMINS (super_admin only) ─────────────────────────── */
export const getAdmins = async (req, res) => {
  try {
    const admins = await adminModel
      .find()
      .select("-password")
      .sort({ createdAt: -1 });
    res.json({ admins });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ─── UPDATE ADMIN ROLE (super_admin only) ──────────────────────── */
export const updateAdminRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["super_admin", "manager", "viewer"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    /* Prevent self-demotion */
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: "Cannot change your own role" });
    }

    const admin = await adminModel
      .findByIdAndUpdate(req.params.id, { role }, { new: true })
      .select("-password");

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.json({ message: "Role updated", admin });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ─── DELETE ADMIN (super_admin only) ──────────────────────────── */
export const deleteAdmin = async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res
        .status(400)
        .json({ message: "Cannot delete your own account" });
    }
    await adminModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Admin deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
