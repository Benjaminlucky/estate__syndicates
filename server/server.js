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

// Define allowed origins
const allowedOrigins = [
  "http://localhost:3000", // Dev
  "https://estatesyndicates.netlify.app", // Test
  "https://estatesindicates.com", // Production
];

// CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Enable this if you're using cookies/auth headers
  })
);

// Body parser
app.use(express.json());

// Routes
app.use("/investor", investorRoutes);

// Server listen
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
