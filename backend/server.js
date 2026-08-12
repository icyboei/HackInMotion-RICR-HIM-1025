const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
// Only allow requests from the React dev server
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

// Health-check route — confirms the API is running
app.get("/", (req, res) => {
  res.json({
    message: "MedSafe API is running 🚀",
  });
});

// Global error handler
// Any route or middleware that calls next(err) lands here
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Something went wrong",
  });
});

app.listen(PORT, () => {
  console.log(`MedSafe backend running on http://localhost:${PORT}`);
});