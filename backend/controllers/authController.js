const bcrypt = require("bcryptjs");
const { getDB } = require("../config/db");
const { createUserDocument } = require("../models/User");

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

module.exports = {
  registerUser,
};