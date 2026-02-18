// server/controllers/investor.controller.js
import Investor from "../models/investors.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import * as Brevo from "@getbrevo/brevo";
import dotenv from "dotenv";
dotenv.config();

/* ============================================================================
   Utility: Generate JWT
============================================================================ */
const generateToken = (investor) => {
  return jwt.sign(
    { id: investor._id, emailAddress: investor.emailAddress },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
};

/* ============================================================================
   Utility: Brevo API Client (uses HTTPS port 443 — never blocked)
============================================================================ */
const brevoClient = new Brevo.TransactionalEmailsApi();
brevoClient.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY,
);

/* ============================================================================
   Utility: Send Email via Brevo HTTP API
============================================================================ */
const sendEmail = async ({ to, toName, subject, html }) => {
  const sendSmtpEmail = new Brevo.SendSmtpEmail();

  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = html;
  sendSmtpEmail.sender = {
    name: "Estate Syndicates",
    email: "noreply@estatesindicates.com", // must be verified in Brevo dashboard
  };
  sendSmtpEmail.to = [{ email: to, name: toName }];

  const response = await brevoClient.sendTransacEmail(sendSmtpEmail);
  console.log(
    "✅ Email sent via Brevo API, messageId:",
    response.body?.messageId,
  );
  return response;
};

/* ============================================================================
   CONTROLLER → CREATE INVESTOR (SIGNUP)
============================================================================ */
export const createInvestor = async (req, res) => {
  const { firstName, lastName, phoneNumber, emailAddress, password } = req.body;

  try {
    if (!firstName || !lastName || !phoneNumber || !emailAddress || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const email = emailAddress.toLowerCase().trim();

    const existingInvestor = await Investor.findOne({
      $or: [{ emailAddress: email }, { phoneNumber }],
    });

    if (existingInvestor) {
      return res.status(400).json({
        message: "Email or phone number already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newInvestor = new Investor({
      firstName,
      lastName,
      phoneNumber,
      emailAddress: email,
      password: hashedPassword,
    });

    await newInvestor.save();
    const token = generateToken(newInvestor);

    return res.status(201).json({
      message: "Investor created successfully",
      token,
      investor: {
        id: newInvestor._id,
        firstName,
        lastName,
        phoneNumber,
        emailAddress: email,
      },
    });
  } catch (error) {
    console.error("Error creating investor:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================================
   CONTROLLER → LOGIN INVESTOR
============================================================================ */
export const loginInvestor = async (req, res) => {
  const { emailAddress, password } = req.body;

  try {
    if (!emailAddress || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const email = emailAddress.toLowerCase().trim();
    const existingInvestor = await Investor.findOne({ emailAddress: email });

    if (!existingInvestor) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingInvestor.password,
    );

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(existingInvestor);

    return res.status(200).json({
      message: "Login successful",
      token,
      investor: {
        id: existingInvestor._id,
        firstName: existingInvestor.firstName,
        lastName: existingInvestor.lastName,
        phoneNumber: existingInvestor.phoneNumber,
        emailAddress: existingInvestor.emailAddress,
      },
    });
  } catch (error) {
    console.error("Error logging in investor:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================================
   CONTROLLER → FORGOT PASSWORD
============================================================================ */
export const forgotPassword = async (req, res) => {
  const { emailAddress } = req.body;

  try {
    if (!emailAddress) {
      return res.status(400).json({ message: "Email address is required" });
    }

    const email = emailAddress.toLowerCase().trim();
    const investor = await Investor.findOne({ emailAddress: email });

    // Always return same message to prevent email enumeration
    if (!investor) {
      return res.status(200).json({
        message: "If that email exists, a reset link has been sent.",
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    investor.resetPasswordToken = hashedToken;
    investor.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await investor.save();

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;

    await sendEmail({
      to: investor.emailAddress,
      toName: investor.firstName,
      subject: "Password Reset Request – Estate Syndicates",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px;">
          <h2 style="color: #b8860b;">Estate Syndicates – Password Reset</h2>
          <p>Hi ${investor.firstName},</p>
          <p>We received a request to reset your password. Click the button below to proceed. 
             This link expires in <strong>1 hour</strong>.</p>
          <a href="${resetURL}"
            style="display:inline-block; background:#b8860b; color:#fff; padding:12px 24px;
                   border-radius:4px; text-decoration:none; font-weight:bold; margin:16px 0;">
            Reset Password
          </a>
          <p>If you didn't request this, you can safely ignore this email — your password will not change.</p>
          <hr style="border:none; border-top:1px solid #eee; margin: 24px 0;" />
          <p style="color:#999; font-size:12px;">
            This link expires in 1 hour. If you need a new one, visit the forgot password page again.
          </p>
        </div>
      `,
    });

    return res.status(200).json({
      message: "If that email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================================
   CONTROLLER → RESET PASSWORD
============================================================================ */
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const investor = await Investor.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!investor) {
      return res
        .status(400)
        .json({ message: "Token is invalid or has expired" });
    }

    investor.password = await bcrypt.hash(password, 10);
    investor.resetPasswordToken = undefined;
    investor.resetPasswordExpires = undefined;
    await investor.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
