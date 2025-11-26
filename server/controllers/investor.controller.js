// server/controllers/investor.controller.js
import Investor from "../models/investors.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

/* ============================================================================
   Utility: Generate JWT
============================================================================ */
const generateToken = (investor) => {
  return jwt.sign(
    {
      id: investor._id,
      emailAddress: investor.emailAddress,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
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
      existingInvestor.password
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
