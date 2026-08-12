const express = require("express");
const { askQuestion } = require("../controllers/aiController");
const { authenticate } = require("../middleware/auth");
const router = express.Router();

router.use(authenticate);

router.post("/ask", askQuestion);   // POST /api/ai/ask

module.exports = router;
