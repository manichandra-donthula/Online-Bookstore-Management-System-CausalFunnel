const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

exports.verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Save decoded token to request object
    next();
  } catch (error) {
    return res.status(400).json({ error: "Invalid token" });
  }
};

// Middleware to check if the user has the correct role (admin or student)
exports.verifyRole = (allowedRole) => {
    return (req, res, next) => {
        const userRole = req.user.role; // Get the user role from the decoded token

        // Check if the user role is in the list of allowed roles
        if (!allowedRole.includes(userRole)) {
            return res.status(403).json({ success: false, message: "Access denied. Insufficient permissions." });
        }

        // Proceed if the user has the correct role
        next();
    };
};
