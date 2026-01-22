import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import { connectDB } from "./config/database.js";
import { config } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import projectRoutes from "./routes/projects.js";

const app: Application = express();

connectDB().catch((err) => {
  console.error("Database connection failed:", err);
});

// Middleware
app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    status: "error",
    statusCode: 404,
    message: "Route not found",
  });
});

app.use(errorHandler);

export default app;
