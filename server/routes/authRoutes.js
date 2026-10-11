import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import requireDatabase from "../middleware/requireDatabase.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// All auth routes need the database and a JWT secret
router.use(requireDatabase);
router.use((req, res, next) => {
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: "JWT_SECRET is missing in server/.env" });
  }
  next();
});

// Create a login token that contains the user's id
const createToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// Only send safe fields to the browser (never the password)
const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }
    if (!EMAIL_PATTERN.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    // Never store the real password. Store a hash of it.
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ token: createToken(user._id), user: formatUser(user) });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }
    console.error("Register error:", error.message);
    res.status(500).json({ message: "Could not create the account." });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // "+password" asks MongoDB to include the hidden password field
    const user = await User.findOne({ email }).select("+password");
    const passwordMatches = user && (await bcrypt.compare(password, user.password));

    // Same message for both cases, so attackers cannot learn which emails exist
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    res.json({ token: createToken(user._id), user: formatUser(user) });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Could not log in." });
  }
});

// GET /api/auth/me - returns the logged-in user (needs a valid token)
router.get("/me", protect, (req, res) => {
  res.json({ user: formatUser(req.user) });
});

export default router;