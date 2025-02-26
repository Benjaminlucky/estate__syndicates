import express from "express";
import Investor from "../models/investors.models.js"; // Import MongoDB model
import Webhook from "@clerk/clerk-sdk-node";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// ✅ Initialize Clerk Webhook Verifier
const clerkWebhook = new Webhook({
  secret: process.env.CLERK_WEBHOOK_SECRET,
});

// 🔹 Clerk Webhook Route (Handles Google OAuth Signups)
router.post("/clerk/webhook", async (req, res) => {
  try {
    const payload = clerkWebhook.verify(req);
    console.log("Received Clerk Webhook:", payload);

    if (payload.type === "user.created") {
      const { id, first_name, last_name, email_addresses } = payload.data;

      // ✅ Ensure email exists
      if (!email_addresses || email_addresses.length === 0) {
        return res.status(400).json({ message: "No email provided" });
      }

      const emailAddress = email_addresses[0].email_address;

      // ✅ Check if user already exists in MongoDB
      const existingInvestor = await Investor.findOne({ emailAddress });
      if (existingInvestor) {
        return res.status(200).json({ message: "User already exists" });
      }

      // 🔹 Generate a random password (OAuth users don't set passwords)
      const randomPassword = Math.random().toString(36).slice(-12);
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      // ✅ Save Google User to MongoDB
      const newInvestor = new Investor({
        firstName: first_name || "NoFirstName",
        lastName: last_name || "NoLastName",
        emailAddress,
        password: hashedPassword, // Store a random password (OAuth users don’t need it)
        clerkId: id,
      });

      await newInvestor.save();
      return res.status(201).json({ message: "Google user saved to MongoDB" });
    }

    res.status(200).json({ message: "Webhook received but ignored" });
  } catch (error) {
    console.error("Webhook Error:", error);
    return res.status(500).json({ message: "Webhook processing failed" });
  }
});

export default router;
