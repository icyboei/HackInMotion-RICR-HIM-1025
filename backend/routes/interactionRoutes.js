const express = require("express");
const { checkInteractions } = require("../controllers/interactionController");
const { authenticate } = require("../middleware/auth");
const router = express.Router();

// Interaction check is public (works without login) but logs history if logged in
router.post("/check", (req, res, next) => {
  // Try auth but don't fail if no token
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    authenticate(req, res, () => next());
  } else {
    next();
  }
}, checkInteractions);

module.exports = router;
