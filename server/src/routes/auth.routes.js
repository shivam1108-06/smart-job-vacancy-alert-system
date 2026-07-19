const express = require("express");
const router = express.Router();

const { register, login, getMe } = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/register", register);
router.post("/login", login);

router.get("/me", authMiddleware, getMe);

router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Welcome to your profile!",
    user: req.user
  });
});

module.exports = router;