const express = require("express");
const router = express.Router();

const {
  createJob,
  getAllJobs
} = require("../controllers/jobs.controller");

const authMiddleware = require("../middlewares/auth.middleware");

// Create Job
router.post("/", authMiddleware, createJob);

// Get All Jobs
router.get("/", authMiddleware, getAllJobs);

module.exports = router;