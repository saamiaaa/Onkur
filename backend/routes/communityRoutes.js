const express = require("express");

const {
  getPosts,
  createPost,
  toggleLike,
} = require("../controllers/communityController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All community routes require a signed-in user.
router.use(protect);

router.get("/posts", getPosts);
router.post("/posts", createPost);
router.patch("/posts/:id/like", toggleLike);

module.exports = router;