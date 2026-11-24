
const mongoose = require("mongoose");
const CommunityPost = require("../models/CommunityPost");
const AuditLog = require("../models/AuditLog");

const allowedCategories = [
  "Discussion",
  "Question",
  "Project Showcase",
  "Opportunity",
];

// Record security-sensitive actions without interrupting the main request.
const recordAudit = async ({
  actor,
  action,
  resourceId,
  resourceOwner,
  outcome,
  details,
}) => {
  try {
    await AuditLog.create({
      actor,
      action,
      resourceType: "CommunityPost",
      resourceId: resourceId?.toString() || "",
      resourceOwner: resourceOwner || null,
      outcome,
      details: details || "",
    });
  } catch (error) {
    console.error("Audit logging error:", error.message);
  }
};

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
      isOwner: post.author?._id?.toString() === req.user.id,
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

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Post title cannot be empty.",
      });
    }

    if (title.trim().length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Post title is too long.",
      });
    }

    if (content !== undefined && typeof content !== "string") {
      return res.status(400).json({
        success: false,
        message: "Post content must be text.",
      });
    }

    if (content && content.length > 3000) {
      return res.status(400).json({
        success: false,
        message: "Post content is too long.",
      });
    }

    const selectedCategory = category || "Discussion";

    if (!allowedCategories.includes(selectedCategory)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post category.",
      });
    }

    // Author is always taken from the verified session.
    // Never accept an author ID from the request body.
    const post = await CommunityPost.create({
      author: req.user.id,
      title: title.trim(),
      content: content?.trim() || "",
      category: selectedCategory,
      tags: ["Community"],
    });

    await post.populate("author", "fullName university");

    await recordAudit({
      actor: req.user.id,
      action: "CREATE_POST",
      resourceId: post._id,
      resourceOwner: post.author._id,
      outcome: "success",
      details: "Community post created.",
    });

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
        isOwner: true,
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

// EDIT a post
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID.",
      });
    }

    const post = await CommunityPost.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    const isOwner = post.author.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      await recordAudit({
        actor: req.user.id,
        action: "EDIT_POST",
        resourceId: post._id,
        resourceOwner: post.author,
        outcome: "denied",
        details: "Attempted to edit another user's post.",
      });

      return res.status(403).json({
        success: false,
        message: "You can only edit your own posts.",
      });
    }

    const updates = {};

    if (req.body.title !== undefined) {
      if (
        typeof req.body.title !== "string" ||
        !req.body.title.trim() ||
        req.body.title.trim().length > 1000
      ) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid post title.",
        });
      }

      updates.title = req.body.title.trim();
    }

    if (req.body.content !== undefined) {
      if (
        typeof req.body.content !== "string" ||
        req.body.content.length > 3000
      ) {
        return res.status(400).json({
          success: false,
          message: "Please provide valid post content.",
        });
      }

      updates.content = req.body.content.trim();
    }

    if (req.body.category !== undefined) {
      if (!allowedCategories.includes(req.body.category)) {
        return res.status(400).json({
          success: false,
          message: "Invalid post category.",
        });
      }

      updates.category = req.body.category;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid changes were provided.",
      });
    }

    Object.assign(post, updates);
    await post.save();
    await post.populate("author", "fullName university");

    await recordAudit({
      actor: req.user.id,
      action: "EDIT_POST",
      resourceId: post._id,
      resourceOwner: post.author._id,
      outcome: "success",
      details: isAdmin && !isOwner
        ? "Admin edited a community post."
        : "Post owner edited their post.",
    });

    res.status(200).json({
      success: true,
      message: "Post updated successfully.",
      post: {
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
        time: post.createdAt,
        isOwner: true,
      },
    });
  } catch (error) {
    console.error("Update community post error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to update your post.",
    });
  }
};

// DELETE a post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID.",
      });
    }

    const post = await CommunityPost.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    const isOwner = post.author.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      await recordAudit({
        actor: req.user.id,
        action: "DELETE_POST",
        resourceId: post._id,
        resourceOwner: post.author,
        outcome: "denied",
        details: "Attempted to delete another user's post.",
      });

      return res.status(403).json({
        success: false,
        message: "You can only delete your own posts.",
      });
    }

    const postId = post._id;
    const postOwner = post.author;

    await post.deleteOne();

    await recordAudit({
      actor: req.user.id,
      action: "DELETE_POST",
      resourceId: postId,
      resourceOwner: postOwner,
      outcome: "success",
      details: isAdmin && !isOwner
        ? "Admin deleted a community post."
        : "Post owner deleted their post.",
    });

    res.status(200).json({
      success: true,
      message: "Post deleted successfully.",
      postId: postId,
    });
  } catch (error) {
    console.error("Delete community post error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to delete your post.",
    });
  }
};

// LIKE or UNLIKE a post
const toggleLike = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID.",
      });
    }

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
  updatePost,
  deletePost,
  toggleLike,
};
