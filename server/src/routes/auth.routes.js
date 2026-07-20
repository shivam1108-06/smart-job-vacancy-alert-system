const express = require("express");
const router = express.Router();

const { register, login, getMe, updateProfile, changePassword, uploadAvatar } = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const uploadAvatarMiddleware = require("../middlewares/upload.middleware");

router.post("/register", register);
router.post("/login", login);

router.get("/me", authMiddleware, getMe);
router.put("/profile", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);
router.put("/upload-avatar", authMiddleware, uploadAvatarMiddleware, uploadAvatar);

router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Welcome to your profile!",
    user: req.user
  });
});

module.exports = router;