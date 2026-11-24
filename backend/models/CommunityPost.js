
const mongoose = require("mongoose");

const communityPostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    content: {
      type: String,
      default: "",
      trim: true,
      maxlength: 3000,
    },
    category: {
      type: String,
      enum: [
        "Discussion",
        "Question",
        "Project Showcase",
        "Opportunity",
      ],
      default: "Discussion",
    },
    tags: {
      type: [String],
      default: ["Community"],
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

communityPostSchema.index({ createdAt: -1 });

module.exports =
  mongoose.models.CommunityPost ||
  mongoose.model("CommunityPost", communityPostSchema);
