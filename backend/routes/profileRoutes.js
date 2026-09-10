const express = require("express");
const multer = require("multer");
const path = require("path");

const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.patch(
  "/picture",
  authMiddleware,
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No profile picture uploaded",
        });
      }

      const user = await User.findById(req.user.userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      user.profilePicture = `/uploads/${req.file.filename}`;

      await user.save();

      res.json({
        success: true,
        profilePicture: user.profilePicture,
      });
    } catch (error) {
      console.error("Profile picture upload error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to update profile picture",
      });
    }
  }
);

module.exports = router;