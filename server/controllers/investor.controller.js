import Investor from "../models/investors.models.js";
import bcrypt from "bcryptjs";
import { clerkClient } from "@clerk/clerk-sdk-node"; // Import Clerk SDK

export const createInvestor = async (req, res) => {
  console.log("Received request data:", req.body);

  try {
    const { firstName, lastName, phoneNumber, emailAddress, password } =
      req.body;

    // ✅ Validate required fields
    if (!firstName || !lastName || !emailAddress || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ Check if investor already exists in MongoDB
    const existingInvestor = await Investor.findOne({ emailAddress });
    if (existingInvestor) {
      return res.status(400).json({ message: "Investor already exists" });
    }

    // ✅ Create user in Clerk
    const clerkUser = await clerkClient.users.createUser({
      email_address: [emailAddress], // Clerk expects an array
      first_name: firstName,
      last_name: lastName,
      password: password, // Clerk handles password hashing internally
    });

    try {
      // ✅ Hash the password before storing in MongoDB
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);

      // ✅ Save user details in MongoDB
      const newInvestor = new Investor({
        firstName,
        lastName,
        phoneNumber,
        emailAddress,
        password: hashedPassword,
        clerkId: clerkUser.id, // Store Clerk's user ID
      });

      await newInvestor.save();

      return res.status(201).json({ message: "Investor created successfully" });
    } catch (dbError) {
      console.error("MongoDB Error:", dbError);

      // ❌ Rollback: Delete the user from Clerk if MongoDB fails
      await clerkClient.users.deleteUser(clerkUser.id);

      return res
        .status(500)
        .json({ message: "Registration failed, please try again." });
    }
  } catch (err) {
    console.error("Clerk Error:", err);
    return res.status(err.status || 500).json({ message: err.message });
  }
};
