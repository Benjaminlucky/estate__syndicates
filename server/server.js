import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import investorRoutes from "./routes/investor.routes.js";

dotenv.config();

const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err.message);
  });

// Your CORS middleware setup:
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173", // Local development URL
        "https://estate-syndicates.onrender.com", // Backend production URL
        "https://estatesindicates.com", // Your frontend production URL
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow requests from these origins
      } else {
        callback(new Error("Not allowed by CORS")); // Reject other origins
      }
    },
    credentials: true, // Allow credentials (cookies) to be sent with requests
  })
);
// Body parser
app.use(express.json());

// Routes
app.use("/investor", investorRoutes);

// Server listen
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
