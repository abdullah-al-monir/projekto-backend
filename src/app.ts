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

// Error handler (must be last)
app.use(errorHandler);

// Start server
const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(config.port, () => {
      console.log(`
╔═══════════════════════════════════════╗
║           🚀 PROJEKTO SERVER 🚀       ║
╠═══════════════════════════════════════╣
║ Server running on port: ${config.port.toString().padEnd(15)}║
║ Environment: ${config.nodeEnv.padEnd(23)}║
║ API: http://localhost:${config.port.toString().padEnd(11)}║
╚═══════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
