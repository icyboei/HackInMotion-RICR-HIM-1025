const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// Middleware
// ==========================================

// Only allow requests from the React dev server
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// Parse JSON request bodies
app.use(express.json());

// ==========================================
// Routes
// ==========================================

app.use("/api/auth", authRoutes);

// Health-check route
app.get("/", (req, res) => {
  res.json({
    message: "MedSafe API is running 🚀",
  });
});

// ==========================================
// Global error handler
// ==========================================

// Any route or middleware that calls next(err) lands here
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