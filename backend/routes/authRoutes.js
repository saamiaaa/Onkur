const express = require("express");
const rateLimit = require("express-rate-limit");

const {
  signup,
  signin,
  logout,
  getMe,
  updateProfile,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Limit repeated signup and login attempts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts. Please try again later.",
  },
});

router.post("/signup", authLimiter, signup);
router.post("/signin", authLimiter, signin);
router.post("/logout", logout);

router.get("/me", protect, getMe);
router.patch("/profile", protect, updateProfile);

module.exports = router;