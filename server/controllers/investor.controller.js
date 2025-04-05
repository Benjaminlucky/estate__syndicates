import Investor from "../models/investors.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

// Controller for creating a new investor

export const createInvestor = async (req, res) => {
  const { firstName, lastName, phoneNumber, emailAddress, password } = req.body;
  console.log("Plain text password before hashing:", password);

  try {
    // check if the email or phone already exists
    const existingInvestor = await Investor.findOne({
      $or: [{ emailAddress }, { phoneNumber }],
    });
    if (existingInvestor) {
      return res
        .status(400)
        .json({ message: "Email or phone number already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword);

    // Create a new Investor instance
    const newInvestor = new Investor({
      firstName,
      lastName,
      phoneNumber,
      emailAddress,
      password: hashedPassword,
    });

    // save the investor to the database
    await newInvestor.save();

    // Generate a JWT token
    const token = jwt.sign(
      { id: newInvestor._id, emailAddress: newInvestor.emailAddress }, // payload
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // Token expiration time
    );

    res.status(201).json({
      message: "Investor created successfully",
      token,
      investor: {
        id: newInvestor._id,
        firstName: newInvestor.firstName,
        lastName: newInvestor.lastName,
        phoneNumber: newInvestor.phoneNumber,
        emailAddress: newInvestor.emailAddress,
      },
    });
  } catch (error) {
    console.error("Error creating investor:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//controller for investor login

export const loginInvestor = async (req, res) => {
  const { emailAddress, password } = req.body;

  try {
    const existingInvestor = await Investor.findOne({ emailAddress });
    // check if password is correct
    const isPasswordValid = await bcrypt.compare(
      password,
      existingInvestor.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: existingInvestor._id, emailAddress: existingInvestor.emailAddress }, // payload
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // Token expiration time
    );

    res.status(200).json({
      message: "Login Successful",
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
    res.status(500).json({ message: "Server error" });
  }
};
