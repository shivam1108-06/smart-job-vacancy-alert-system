const multer = require("multer");
const path = require("path");
const fs = require("fs");

const AVATAR_UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads", "avatars");

if (!fs.existsSync(AVATAR_UPLOAD_DIR)) {
  fs.mkdirSync(AVATAR_UPLOAD_DIR, { recursive: true });
}

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, AVATAR_UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `user-${req.user.userId}-${Date.now()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(new Error("Only JPG, JPEG, and PNG images are allowed."));
  }

  cb(null, true);
};

const avatarUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE }
});

const uploadAvatarMiddleware = (req, res, next) => {
  avatarUpload.single("avatar")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      const message =
        err.code === "LIMIT_FILE_SIZE"
          ? "Image size must not exceed 2MB."
          : err.message;

      return res.status(400).json({
        success: false,
        message
      });
    }

    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image to upload."
      });
    }

    next();
  });
};

module.exports = uploadAvatarMiddleware;
