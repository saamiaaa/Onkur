
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verify the session and load the actual account.
const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.onkur_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please sign in to access this resource.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing.");
      return res.status(500).json({
        success: false,
        message: "Authentication service is not configured.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication session.",
      });
    }

    const user = await User.findById(decoded.id).select("_id role");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Your account no longer exists. Please sign in again.",
      });
    }

    req.user = {
      id: user._id.toString(),
      role: user.role || "student",
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError" ||
        error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Your session is invalid or has expired. Please sign in again.",
      });
    }

    console.error("Authentication error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to verify your session.",
    });
  }
};

// Restrict routes to selected account roles.
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action.",
      });
    }

    next();
  };
};

module.exports = {
  protect,
  authorize,
};
