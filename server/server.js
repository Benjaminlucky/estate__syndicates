import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import investorRoutes from "./routes/investor.routes.js";

dotenv.config();
console.log("Clerk Secret Key:", process.env.CLERK_SECRET_KEY);

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

const port = process.env.PORT || 5000;
const allowedOrigins = [process.env.CLIENT_URL];

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/investor/", investorRoutes);

// 🔹 Use the Clerk Webhook Route
// app.use(clerkWebhookRoutes);

app.listen(port, () => console.log(`Server is running on port ${port}`));
