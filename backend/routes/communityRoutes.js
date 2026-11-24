
const express = require("express");

const {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
} = require("../controllers/communityController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All community routes require a verified account.
router.use(protect);

router.get("/posts", getPosts);
router.post("/posts", createPost);
router.patch("/posts/:id", updatePost);
router.delete("/posts/:id", deletePost);
router.patch("/posts/:id/like", toggleLike);

module.exports = router;
