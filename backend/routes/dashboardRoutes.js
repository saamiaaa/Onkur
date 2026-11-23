
const express = require("express");

const {
  getDashboard,
  updateDashboard,
} = require("../controllers/dashboardController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Both endpoints require authentication.
router.use(protect);

router.get("/", getDashboard);
router.patch("/", updateDashboard);

module.exports = router;
