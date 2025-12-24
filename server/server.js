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

dotenv.config();

const app = express();

/* ----------------------------------------------------- */
/*                 MIDDLEWARE                            */
/* ----------------------------------------------------- */

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Allowed frontend + local domains
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",

  // 🔥 YOUR FRONTEND PRODUCTION DOMAIN
  "https://estatesindicates.com",
  "https://www.estatesindicates.com",

  // Render App Domain (backend itself)
  "https://estate-syndicates.onrender.com",
];

// CORS Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Allow Postman, mobile apps, curl

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ CORS BLOCKED ORIGIN:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Preflight
app.options("*", cors());

/* ----------------------------------------------------- */
/*                 DATABASE CONNECT                      */
/* ----------------------------------------------------- */

mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("MongoDB Error:", err.message));

/* ----------------------------------------------------- */
/*                     ROUTES                            */
/* ----------------------------------------------------- */

app.use("/investor", investorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/team-members", teamMemberRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/expenses", expenseRoutes);

/* ----------------------------------------------------- */
/*                   BASE ROUTE                          */
/* ----------------------------------------------------- */

app.get("/", (req, res) => {
  res.json({ status: "API server running" });
});

/* ----------------------------------------------------- */
/*                    404 HANDLER                        */
/* ----------------------------------------------------- */

app.use("*", (req, res) => {
  return res.status(404).json({
    error: "API endpoint not found",
    route: req.originalUrl,
  });
});

/* ----------------------------------------------------- */
/*                    START SERVER                       */
/* ----------------------------------------------------- */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
