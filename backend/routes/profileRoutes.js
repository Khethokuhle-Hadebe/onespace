const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

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

      const result = await new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream(
    {
      folder: "onespace/profile-pictures",
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

user.profilePicture = result.secure_url;
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