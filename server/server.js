import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import investorRoutes from "./routes/investor.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import projectsRoutes from "./routes/Project.route.js";

dotenv.config();

const app = express();

/* ----------------------------------------------------- */
/*                 MIDDLEWARE                            */
/* ----------------------------------------------------- */

app.use(express.json({ limit: "50mb" })); // ✅ BASE64 Compatible
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://estate-syndicates.onrender.com",
  "https://estatesyndicates.com",
  "https://www.estatesyndicates.com",
];

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://estatesindicates.com",
      "https://estate-syndicates.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors()); // <-- IMPORTANT: allows preflight

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

/* ----------------------------------------------------- */
/*    OPTIONAL: Catch-all for production deployments     */
/* ----------------------------------------------------- */
app.get("/", (req, res) => {
  res.json({ status: "API server running" });
});

app.use("*", (req, res) => {
  res.status(404).json({
    error: "API endpoint not found",
    route: req.originalUrl,
  });
});

/* ----------------------------------------------------- */
/*                    START SERVER                       */
/* ----------------------------------------------------- */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
