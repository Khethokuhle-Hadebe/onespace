const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
     user: {
  id: user._id,
  username: user.username,
  email: user.email,
  displayName: user.displayName,
  bio: user.bio,
  profilePicture: user.profilePicture,
},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Auth routes working",
  });
});

router.patch("/profile", authMiddleware, async (req, res) => {
  try {
    const { username, displayName, bio } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (username !== undefined) {
  const trimmedUsername = username.trim();

  if (!trimmedUsername) {
    return res.status(400).json({
      success: false,
      message: "Username cannot be empty",
    });
  }

  const existingUser = await User.findOne({
    username: trimmedUsername,
    _id: { $ne: user._id },
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "Username is already taken",
    });
  }

  user.username = trimmedUsername;
}

if (displayName !== undefined) {
  user.displayName = displayName.trim();
}

if (bio !== undefined) {
  user.bio = bio.trim();
}

    await user.save();

    res.json({
      success: true,
      user: {
  id: user._id,
  username: user.username,
  email: user.email,
  displayName: user.displayName,
  bio: user.bio,
  profilePicture: user.profilePicture,
},
    });
  } catch (error) {
    console.error("Profile update error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email and password are required",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username or email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
  id: user._id,
  username: user.username,
  email: user.email,
  displayName: user.displayName,
  bio: user.bio,
  profilePicture: user.profilePicture,
},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
  id: user._id,
  username: user.username,
  email: user.email,
  displayName: user.displayName,
  bio: user.bio,
  profilePicture: user.profilePicture,
},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;