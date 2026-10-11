import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Use this on any route that needs a logged-in user.
// The browser sends:  Authorization: Bearer <token>
const protect = async (req, res, next) => {
  const header = req.headers.authorization || "";

  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not logged in." });
  }

  const token = header.slice(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User no longer exists." });
    }

    req.user = user; // available to the route that runs next
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token. Please log in again." });
  }
};

// Use this AFTER protect on routes that only admins may use
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  res.status(403).json({ message: "Admin access required." });
};

export default protect;