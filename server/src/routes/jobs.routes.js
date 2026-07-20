const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");

const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  syncJobs,
  getSyncHistory,
} = require("../controllers/jobs.controller");

router.post("/", authMiddleware, createJob);

router.post("/sync", authMiddleware, syncJobs);

router.get("/", authMiddleware, getAllJobs);

router.get("/sync-history", authMiddleware, getSyncHistory);

router.get("/:id", authMiddleware, getJobById);

router.put("/:id", authMiddleware, updateJob);

router.delete("/:id", authMiddleware, deleteJob);

module.exports = router;