import bcrypt from "bcryptjs";
import crypto from "crypto";
import TeamMember from "../models/TeamMember.js";
import { Resend } from "resend";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

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
  try {
    console.log("📧 Sending email via Resend to:", email);

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

    const { data, error } = await resend.emails.send({
      from: "Estates Indicates <onboarding@resend.dev>",
      to: email,
      subject: "Your Estates Indicates Account Credentials",
      html: htmlMessage,
    });

    if (error) {
      throw new Error(error.message);
    }

    console.log("✅ Email sent successfully via Resend:", data.id);
    console.log(`📧 Login URL in email: ${loginUrl}`);
    return { success: true, id: data.id };
  } catch (error) {
    console.error("❌ Resend email error:", error.message);
    throw error;
  }
};

// ============================================
// CREATE TEAM MEMBER
// ============================================
export const createTeamMember = async (req, res) => {
  try {
    const { fullName, email, phone, role, employmentType, assignedProjects } =
      req.body;

    // Validation
    if (!fullName || !email || !role) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, and role are required",
      });
    }

    // Check if team member already exists
    const existingMember = await TeamMember.findOne({ email });
    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
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
      employmentType: employmentType || "Contract",
      assignedProjects: assignedProjects || [],
      password: hashedPassword,
      passwordChangeRequired: true,
      isActive: true,
    });

    // Populate projects
    await teamMember.populate("assignedProjects");

    // Try to send email
    let emailSent = false;
    let emailError = null;

    try {
      await sendCredentialsEmail(email, fullName, temporaryPassword);
      emailSent = true;
      console.log("✅ Credentials email sent successfully");
    } catch (error) {
      emailError = error.message;
      console.error("❌ Email failed:", error.message);
    }

    // Return success with email status
    res.status(201).json({
      success: true,
      message: emailSent
        ? "Team member created and credentials sent via email"
        : `Team member created, but email failed: ${emailError}. Temporary password: ${temporaryPassword}`,
      teamMember,
      emailSent,
      ...(!emailSent && { temporaryPassword }), // Include password if email failed
    });
  } catch (error) {
    console.error("❌ Create Team Member Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create team member",
    });
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
    const { fullName, phone, role, employmentType, assignedProjects } =
      req.body;

    const teamMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      {
        fullName,
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

    console.log("🔐 Login attempt for:", email);

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find member by email
    const member = await TeamMember.findOne({ email }).populate(
      "assignedProjects"
    );

    if (!member) {
      console.log("❌ User not found:", email);
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if account is active
    if (!member.isActive) {
      console.log("❌ Account deactivated:", email);
      return res.status(403).json({
        success: false,
        message:
          "Your account has been deactivated. Please contact your administrator.",
      });
    }

    // Check password
    const isMatch = await member.matchPassword(password);
    if (!isMatch) {
      console.log("❌ Invalid password for:", email);
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = member.generateToken();

    console.log("✅ Login successful for:", email);

    // Return success
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      member: {
        id: member._id,
        fullName: member.fullName,
        email: member.email,
        role: member.role,
        employmentType: member.employmentType,
        assignedProjects: member.assignedProjects,
        passwordChangeRequired: member.passwordChangeRequired,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Login failed. Please try again.",
    });
  }
};

// ============================================
// CHANGE PASSWORD
// ============================================
export const changePassword = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    // Validation
    if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    // Find member
    const member = await TeamMember.findOne({ email });
    if (!member) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password
    const isMatch = await member.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    member.password = hashedPassword;
    member.passwordChangeRequired = false;
    await member.save();

    console.log("✅ Password changed successfully for:", email);

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("❌ Change password error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to change password",
    });
  }
};
