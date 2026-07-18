const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");

const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require("../controllers/jobs.controller");

router.post("/", authMiddleware, createJob);

router.get("/", authMiddleware, getAllJobs);

router.get("/:id", authMiddleware, getJobById);

router.put("/:id", authMiddleware, updateJob);

router.delete("/:id", authMiddleware, deleteJob);

module.exports = router;