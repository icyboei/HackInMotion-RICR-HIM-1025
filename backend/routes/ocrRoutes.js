const express = require("express");
const { extractMedicinesFromText } = require("../controllers/ocrController");
const { authenticate } = require("../middleware/auth");
const router = express.Router();

// OCR text extraction — auth optional (stores history if logged in)
router.post("/extract", (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    authenticate(req, res, () => next());
  } else {
    next();
  }
}, extractMedicinesFromText);

module.exports = router;
