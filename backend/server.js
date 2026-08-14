const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./config/db");
const authRoutes        = require("./routes/authRoutes");
const medicineRoutes    = require("./routes/medicineRoutes");
const medicationRoutes  = require("./routes/medicationRoutes");
const interactionRoutes = require("./routes/interactionRoutes");
const allergyRoutes     = require("./routes/allergyRoutes");
const reminderRoutes    = require("./routes/reminderRoutes");
const historyRoutes     = require("./routes/historyRoutes");
const aiRoutes          = require("./routes/aiRoutes");
const ocrRoutes         = require("./routes/ocrRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// Middleware
// ==========================================

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174"
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Fallback allow in dev
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb" }));

// ==========================================
// Routes
// ==========================================

app.use("/api/auth",         authRoutes);
app.use("/api/medicines",    medicineRoutes);
app.use("/api/medications",  medicationRoutes);
app.use("/api/interactions", interactionRoutes);
app.use("/api/allergies",    allergyRoutes);
app.use("/api/reminders",    reminderRoutes);
app.use("/api/history",      historyRoutes);
app.use("/api/ai",           aiRoutes);
app.use("/api/ocr",          ocrRoutes);

// Health-check endpoints
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "medisafe-api",
  });
});

app.get("/", (req, res) => {
  res.json({
    message: "MedSafe API is running 🚀",
    version: "2.0.0",
    endpoints: [
      "/health",
      "/api/auth",
      "/api/medicines",
      "/api/medications",
      "/api/interactions",
      "/api/allergies",
      "/api/reminders",
      "/api/history",
      "/api/ai",
      "/api/ocr",
    ],
  });
});

// ==========================================
// Global error handler
// ==========================================

app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  const isProd = process.env.NODE_ENV === "production";
  res.status(status).json({
    error: isProd && status === 500 ? "Internal server error" : (err.message || "Something went wrong"),
  });
});

// ==========================================
// Start server & Graceful Shutdown
// ==========================================

let server;

async function startServer() {
  try {
    await connectDB();
    server = app.listen(PORT, () => {
      console.log(`MedSafe backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

function handleShutdown(signal) {
  console.log(`Received ${signal}. Shutting down server gracefully...`);
  if (server) {
    server.close(() => {
      console.log("HTTP server closed.");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

process.on("SIGTERM", () => handleShutdown("SIGTERM"));
process.on("SIGINT", () => handleShutdown("SIGINT"));

startServer();