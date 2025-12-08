import bcrypt from "bcryptjs";
import crypto from "crypto";
import TeamMember from "../models/TeamMember.js";
import nodemailer from "nodemailer";

// Generate random password
const generatePassword = () => {
  return crypto.randomBytes(8).toString("hex");
};

// ============================================
// DYNAMIC FRONTEND URL HELPER
// ============================================
const getFrontendUrl = () => {
  const nodeEnv = process.env.NODE_ENV;

  if (nodeEnv === "development") {
    return process.env.FRONTEND_URL_DEV || "http://localhost:5173";
  } else {
    return process.env.FRONTEND_URL_PROD || "https://estatesindicates.com";
  }
};

// ============================================
// SEND CREDENTIALS EMAIL
// ============================================
export const sendCredentialsEmail = async (email, fullName, tempPassword) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Get dynamic frontend URL based on environment
  const frontendUrl = getFrontendUrl();
  const loginUrl = `${frontendUrl}/team/login`;

  const htmlMessage = `
  <div style="
    background:#f4f4f7;
    padding:40px 0;
    font-family:Arial, sans-serif;
  ">
    <div style="
      max-width:600px;
      margin:0 auto;
      background:#ffffff;
      border-radius:12px;
      overflow:hidden;
      box-shadow:0 4px 12px rgba(0,0,0,0.08);
    ">
      <div style="
        background:#111827;
        color:#ffffff;
        padding:24px 32px;
        text-align:center;
      ">
        <h1 style="margin:0; font-size:24px;">
          Estates Indicates
        </h1>
      </div>

      <div style="padding:32px; color:#333;">
        <h2 style="font-size:20px; margin-top:0;">
          Welcome, ${fullName}!
        </h2>

        <p style="line-height:1.6; font-size:15px;">
          Your account has been successfully created. Below are your login credentials:
        </p>

        <div style="
          background:#f9fafb;
          padding:20px;
          border-radius:8px;
          border:1px solid #e5e7eb;
          margin-bottom:25px;
        ">
          <p style="margin:0 0 10px;">
            <strong>Email:</strong> ${email}
          </p>
          <p style="margin:0;">
            <strong>Temporary Password:</strong> ${tempPassword}
          </p>
        </div>

        <p style="line-height:1.6; font-size:15px;">
          Please log in and change your password immediately for security purposes.
        </p>

        <a href="${loginUrl}"
          style="
            display:inline-block;
            background:#2563eb;
            color:#ffffff;
            padding:12px 20px;
            border-radius:6px;
            text-decoration:none;
            font-size:15px;
            margin-top:10px;
          ">
          Go to Login
        </a>
      </div>

      <div style="
        background:#f3f4f6;
        padding:20px;
        text-align:center;
        font-size:12px;
        color:#6b7280;
      ">
        © ${new Date().getFullYear()} Estates Indicates. All rights reserved.
      </div>
    </div>
  </div>
  `;

  const mailOptions = {
    from: `"Estates Indicates" <${
      process.env.SMTP_USER || "info@estatesindicates.com"
    }>`,
    to: email,
    subject: "Your Estates Indicates Account Credentials",
    html: htmlMessage,
  };

  // Log the URL being used (helpful for debugging)
  console.log(`📧 Sending email with login URL: ${loginUrl}`);

  return transporter.sendMail(mailOptions);
};

// ============================================
// CREATE TEAM MEMBER
// ============================================
export const createTeamMember = async (req, res) => {
  try {
    const { fullName, email, phone, role, employmentType, assignedProjects } =
      req.body;

    // Check if team member already exists
    const existingMember = await TeamMember.findOne({ email });
    if (existingMember) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Generate temporary password
    const temporaryPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    // Create team member
    const teamMember = await TeamMember.create({
      fullName,
      email,
      phone,
      role,
      employmentType,
      assignedProjects: assignedProjects || [],
      password: hashedPassword,
      passwordChangeRequired: true,
      isActive: true,
    });

    // Send credentials email with dynamic URL
    try {
      await sendCredentialsEmail(email, fullName, temporaryPassword);
      console.log(`✅ Credentials email sent to: ${email}`);
    } catch (emailError) {
      console.error("❌ Email sending failed:", emailError);
      // Don't fail the request if email fails
    }

    // Populate projects before sending response
    await teamMember.populate("assignedProjects");

    res.status(201).json({
      success: true,
      message: "Team member created and credentials sent via email",
      teamMember,
    });
  } catch (error) {
    console.error("Create Team Member Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// GET ALL TEAM MEMBERS
// ============================================
export const getTeamMembers = async (req, res) => {
  try {
    const teamMembers = await TeamMember.find()
      .populate("assignedProjects")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      teamMembers,
    });
  } catch (error) {
    console.error("Get Team Members Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// GET ONE TEAM MEMBER
// ============================================
export const getTeamMemberById = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id).populate(
      "assignedProjects"
    );

    if (!teamMember) {
      return res
        .status(404)
        .json({ success: false, message: "Team member not found" });
    }

    res.status(200).json({
      success: true,
      teamMember,
    });
  } catch (error) {
    console.error("Get Team Member Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// UPDATE TEAM MEMBER
// ============================================
export const updateTeamMember = async (req, res) => {
  try {
    const { fullName, email, phone, role, employmentType, assignedProjects } =
      req.body;

    const teamMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      {
        fullName,
        email,
        phone,
        role,
        employmentType,
        assignedProjects,
      },
      { new: true, runValidators: true }
    ).populate("assignedProjects");

    if (!teamMember) {
      return res
        .status(404)
        .json({ success: false, message: "Team member not found" });
    }

    res.status(200).json({
      success: true,
      message: "Team member updated successfully",
      teamMember,
    });
  } catch (error) {
    console.error("Update Team Member Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// TOGGLE ACTIVE STATUS
// ============================================
export const toggleTeamMemberStatus = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);

    if (!teamMember) {
      return res
        .status(404)
        .json({ success: false, message: "Team member not found" });
    }

    teamMember.isActive = !teamMember.isActive;
    await teamMember.save();

    await teamMember.populate("assignedProjects");

    res.status(200).json({
      success: true,
      message: `Team member ${
        teamMember.isActive ? "activated" : "deactivated"
      } successfully`,
      teamMember,
    });
  } catch (error) {
    console.error("Toggle Status Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// DELETE TEAM MEMBER
// ============================================
export const deleteTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findByIdAndDelete(req.params.id);

    if (!teamMember) {
      return res
        .status(404)
        .json({ success: false, message: "Team member not found" });
    }

    res.status(200).json({
      success: true,
      message: "Team member deleted successfully",
    });
  } catch (error) {
    console.error("Delete Team Member Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// LOGIN TEAM MEMBER
// ============================================
export const loginTeamMember = async (req, res) => {
  try {
    const { email, password } = req.body;

    const member = await TeamMember.findOne({ email });
    if (!member) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await member.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!member.isActive) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    const token = member.generateToken();

    res.json({
      success: true,
      token,
      member,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================================
// RESEND CREDENTIALS EMAIL (BONUS FEATURE)
// ============================================
export const resendCredentials = async (req, res) => {
  try {
    const { memberId } = req.body;

    const member = await TeamMember.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: "Team member not found" });
    }

    // Generate new temporary password
    const temporaryPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    // Update password
    member.password = hashedPassword;
    member.passwordChangeRequired = true;
    await member.save();

    // Send email with new credentials
    await sendCredentialsEmail(
      member.email,
      member.fullName,
      temporaryPassword
    );

    res.status(200).json({
      success: true,
      message: "New credentials sent via email",
    });
  } catch (error) {
    console.error("Resend Credentials Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
