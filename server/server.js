import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import investorRoutes from "./routes/investor.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import projectsRoutes from "./routes/Project.route.js";
import teamMemberRoutes from "./routes/TeamMember.routes.js";
import vendorRoutes from "./routes/Vendor.routes.js";
import expenseRoutes from "./routes/expense.routes.js";
import investmentRoutes from "./routes/investment.routes.js";
import milestoneRoutes from "./routes/milestone.routes.js";

dotenv.config();
const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://estatesindicates.com",
  "https://www.estatesindicates.com",
  "https://estate-syndicates.onrender.com",
];
app.use(
  cors({
    origin: (origin, cb) =>
      !origin || allowedOrigins.includes(origin)
        ? cb(null, true)
        : cb(new Error("Not allowed by CORS")),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.options("*", cors());

mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("MongoDB Error:", err.message));

app.use("/investor", investorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/team-members", teamMemberRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/milestones", milestoneRoutes);

app.get("/", (req, res) => res.json({ status: "API server running" }));
app.use("*", (req, res) =>
  res.status(404).json({ error: "Not found", route: req.originalUrl }),
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
