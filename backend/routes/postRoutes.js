const express = require("express");
const multer = require("multer");
const Post = require("../models/Post");
const cloudinary = require("../config/cloudinary");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// Create a post
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { content } = req.body;

    if (!content?.trim() && !req.file) {
      return res.status(400).json({
        success: false,
        message: "Post cannot be empty",
      });
    }

    let imageUrl = null;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "onespace/posts",
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        stream.end(req.file.buffer);
      });

      imageUrl = result.secure_url;
    }

    const post = await Post.create({
      user: req.user.userId,
      content: content?.trim() || "",
      image: imageUrl,
    });

    await post.populate("user", "username displayName profilePicture");

    res.status(201).json({
      success: true,
      post,
    });
  } catch (error) {
    console.error("Post creation error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get all posts
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const posts = await Post.find()
      .populate("user", "username displayName profilePicture")
      .populate("comments.user", "username profilePicture")
      .sort({ createdAt: -1 });

    const formattedPosts = posts.map((post) => ({
      ...post.toObject(),
      liked: post.likedBy.some(
        (id) => id.toString() === userId.toString()
      ),
    }));

    res.json({
      success: true,
      count: posts.length,
      posts: formattedPosts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Like a post
router.patch("/:id/like", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const userId = req.user.userId;

    const alreadyLiked = post.likedBy.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyLiked) {
      post.likedBy = post.likedBy.filter(
        (id) => id.toString() !== userId.toString()
      );

      post.likes = Math.max(0, post.likes - 1);
    } else {
      post.likedBy.push(userId);
      post.likes += 1;
    }

    await post.save();

    res.json({
      success: true,
      likes: post.likes,
      liked: !alreadyLiked,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Add a comment
router.post("/:id/comments", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment cannot be empty",
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    post.comments.push({
      user: req.user.userId,
      text: text.trim(),
    });

    await post.save();

    await post.populate("comments.user", "username profilePicture");

    res.json({
      success: true,
      comments: post.comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Share a post
router.patch("/:id/share", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    post.shares += 1;

    await post.save();

    res.json({
      success: true,
      shares: post.shares,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;