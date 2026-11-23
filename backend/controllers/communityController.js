const CommunityPost = require("../models/CommunityPost");

// GET all community posts
const getPosts = async (req, res) => {
  try {
    const posts = await CommunityPost.find()
      .populate("author", "fullName university")
      .sort({ createdAt: -1 });

    const formattedPosts = posts.map((post) => ({
      id: post._id,
      name: post.author?.fullName || "Onkur Student",
      university: post.author?.university || "University not added",
      title: post.title,
      content: post.content,
      category: post.category,
      tags: post.tags,
      likes: post.likes.length,
      liked: post.likes.some(
        (userId) => userId.toString() === req.user.id
      ),
      comments: 0,
      shares: 0,
      time: post.createdAt,
      initials: (post.author?.fullName || "OS")
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      color: "violet",
      featured: false,
    }));

    res.status(200).json({
      success: true,
      posts: formattedPosts,
    });
  } catch (error) {
    console.error("Get community posts error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to load community posts.",
    });
  }
};

// CREATE a post
const createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Post content cannot be empty.",
      });
    }

    const allowedCategories = [
      "Discussion",
      "Question",
      "Project Showcase",
      "Opportunity",
    ];

    const selectedCategory = category || "Discussion";

    if (!allowedCategories.includes(selectedCategory)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post category.",
      });
    }

    const post = await CommunityPost.create({
      author: req.user.id,
      title: title.trim(),
      content: content?.trim() || "",
      category: selectedCategory,
      tags: ["Community"],
    });

    await post.populate("author", "fullName university");

    res.status(201).json({
      success: true,
      message: "Post published successfully.",
      post: {
        id: post._id,
        name: post.author.fullName,
        university: post.author.university || "University not added",
        title: post.title,
        content: post.content,
        category: post.category,
        tags: post.tags,
        likes: 0,
        liked: false,
        comments: 0,
        shares: 0,
        time: post.createdAt,
        initials: post.author.fullName
          .split(" ")
          .map((word) => word[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
        color: "violet",
        featured: false,
      },
    });
  } catch (error) {
    console.error("Create community post error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to publish your post.",
    });
  }
};

// LIKE or UNLIKE a post
const toggleLike = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    const alreadyLiked = post.likes.some(
      (userId) => userId.toString() === req.user.id
    );

    if (alreadyLiked) {
      post.likes.pull(req.user.id);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();

    res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      likes: post.likes.length,
    });
  } catch (error) {
    console.error("Toggle like error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to update like.",
    });
  }
};

module.exports = {
  getPosts,
  createPost,
  toggleLike,
};