const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required."
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email
      }
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const register = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing"
      });
    }

    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required."
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address."
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword
      }
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const USER_SELECT_FIELDS = {
  id: true,
  fullName: true,
  email: true,
  mobile: true,
  bio: true,
  avatarUrl: true,
  createdAt: true
};

const sanitizeUser = (user, req) => ({
  id: user.id,
  name: user.fullName,
  email: user.email,
  role: "User",
  mobile: user.mobile,
  bio: user.bio,
  avatarUrl: user.avatarUrl
    ? `${req.protocol}://${req.get("host")}${user.avatarUrl}`
    : null,
  joinedDate: user.createdAt
});

const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: USER_SELECT_FIELDS
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    return res.status(200).json({
      success: true,
      user: sanitizeUser(user, req)
    });

  } catch (error) {
    console.error("Get Me Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { fullName, email, mobile, bio } = req.body;

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Full name is required."
      });
    }

    if (email && !validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address."
      });
    }

    if (mobile && !validator.isMobilePhone(mobile, "any")) {
      return res.status(400).json({
        success: false,
        message: "Invalid mobile number."
      });
    }

    if (bio && bio.length > 300) {
      return res.status(400).json({
        success: false,
        message: "Bio must be 300 characters or fewer."
      });
    }

    if (email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser && existingUser.id !== userId) {
        return res.status(409).json({
          success: false,
          message: "Email already in use."
        });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: fullName.trim(),
        ...(email && { email }),
        mobile: mobile ? mobile.trim() : null,
        bio: bio ? bio.trim() : null
      },
      select: USER_SELECT_FIELDS
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: sanitizeUser(updatedUser, req)
    });

  } catch (error) {
    console.error("Update Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const PASSWORD_MIN_LENGTH = 8;

const getPasswordStrengthError = (password) => {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`;
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }

  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number.";
  }

  return null;
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required."
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match."
      });
    }

    const strengthError = getPasswordStrengthError(newPassword);

    if (strengthError) {
      return res.status(400).json({
        success: false,
        message: strengthError
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid current password."
      });
    }

    const isSameAsCurrentPassword = await bcrypt.compare(
      newPassword,
      user.password
    );

    if (isSameAsCurrentPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from the current password."
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    return res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });

  } catch (error) {
    console.error("Change Password Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user.userId;

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatarUrl: true }
    });

    const avatarPath = `/uploads/avatars/${req.file.filename}`;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: avatarPath },
      select: USER_SELECT_FIELDS
    });

    if (existingUser?.avatarUrl) {
      const oldFilePath = path.join(__dirname, "..", "..", existingUser.avatarUrl);

      fs.unlink(oldFilePath, () => {});
    }

    return res.status(200).json({
      success: true,
      message: "Profile photo updated successfully",
      user: sanitizeUser(updatedUser, req)
    });

  } catch (error) {
    console.error("Upload Avatar Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  uploadAvatar
};