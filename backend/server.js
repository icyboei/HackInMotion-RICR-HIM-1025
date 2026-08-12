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

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
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

// Health-check route
app.get("/", (req, res) => {
  res.json({
    message: "MedSafe API is running 🚀",
    version: "2.0.0",
    endpoints: [
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
  res.status(err.status || 500).json({
    error: err.message || "Something went wrong",
  });
});

// ==========================================
// Start server only after MongoDB connects
// ==========================================

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`MedSafe backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();