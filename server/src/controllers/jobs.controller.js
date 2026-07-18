const prisma = require("../config/prisma");

const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      salary,
      description,
      applyLink
    } = req.body;

    // Validation
    if (!title || !company || !location || !description || !applyLink) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields."
      });
    }

    const job = await prisma.job.create({
      data: {
        title,
        company,
        location,
        salary,
        description,
        applyLink,
        userId: req.user.userId
      }
    });

    return res.status(201).json({
      success: true,
      message: "Job created successfully.",
      job
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      where: {
        userId: req.user.userId
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createJob,
  getAllJobs
};