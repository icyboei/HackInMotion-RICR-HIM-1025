const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getDB } = require("../config/db");
const { createUserDocument } = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "medsafe_secret_key_2024";
const JWT_EXPIRES_IN = "7d";

async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body || {};

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const db = getDB();

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = createUserDocument({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const result = await db.collection("users").insertOne(user);

    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertedId,
    });
  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const db = getDB();
    const user = await db.collection("users").findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

module.exports = {
  registerUser,
  loginUser,
};