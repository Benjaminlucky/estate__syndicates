import bcrypt from "bcryptjs";
import crypto from "crypto";
import TeamMember from "../models/TeamMember.js";
import nodemailer from "nodemailer";

// Generate random password
const generatePassword = () => {
  return crypto.randomBytes(8).toString("hex");
};

// Send credentials email with timeout and better error handling
export const sendCredentialsEmail = async (email, fullName, tempPassword) => {
  try {
    console.log("📧 Attempting to send email to:", email);
    console.log("SMTP Config:", {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      secure: process.env.SMTP_SECURE === "true",
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // ✅ Add connection timeout
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 10000,
      // ✅ Add TLS options for better compatibility
      tls: {
        rejectUnauthorized: false, // Allow self-signed certificates
        minVersion: "TLSv1.2",
      },
      debug: true,
      logger: true,
    });

    // ✅ Verify connection with timeout
    console.log("🔌 Verifying SMTP connection...");
    await Promise.race([
      transporter.verify(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("SMTP verification timeout")), 15000)
      ),
    ]);
    console.log("✅ SMTP connection verified");

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

          <a href="https://estatesindicates.com/login"
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
      from: `"Estates Indicates" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your Estates Indicates Account Credentials",
      html: htmlMessage,
    };

    console.log("📤 Sending email...");
    const info = await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Email send timeout")), 20000)
      ),
    ]);

    console.log("✅ Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email sending failed:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Full error:", error);
    throw error;
  }
};

// CREATE TEAM MEMBER
export const createTeamMember = async (req, res) => {
  try {
    const { fullName, email, phone, role, employmentType, assignedProjects } =
      req.body;

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
      employmentType,
      assignedProjects: assignedProjects || [],
      password: hashedPassword,
      passwordChangeRequired: true,
      isActive: true,
    });

    // Populate projects before sending response
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
      console.error(
        "❌ Email sending failed, but user was created:",
        error.message
      );
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
      message: error.message,
    });
  }
};

// GET ALL TEAM MEMBERS
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

// GET ONE TEAM MEMBER
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

// UPDATE TEAM MEMBER
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

// TOGGLE ACTIVE STATUS
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

// DELETE TEAM MEMBER
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

// LOGIN TEAM MEMBER
export const loginTeamMember = async (req, res) => {
  try {
    const { email, password } = req.body;

    const member = await TeamMember.findOne({ email });
    if (!member) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await member.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!member.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    const token = member.generateToken();

    res.json({
      success: true,
      token,
      member,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
