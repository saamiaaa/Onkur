
const express = require("express");

const {
  analyzeProfile,
  chatAssistant,
} = require("../controllers/aiController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/analyze-profile", protect, analyzeProfile);

router.post("/chat", protect, chatAssistant);

module.exports = router;
