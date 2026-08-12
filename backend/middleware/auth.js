const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "medsafe_secret_key_2024";

/**
 * auth.js — JWT Authentication Middleware
 * Verifies the Bearer token in the Authorization header.
 * Attaches decoded user payload to req.user.
 * Responds 401 if token is missing or invalid.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { userId, email, name, iat, exp }
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired. Please log in again." });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = { authenticate };
