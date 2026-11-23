
const express = require("express");
const { analyzeProfile } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/analyze-profile", protect, analyzeProfile);

module.exports = router;
