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

const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findFirst({
      where: {
        id: Number(id),
        userId: req.user.userId
      }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found."
      });
    }

    return res.status(200).json({
      success: true,
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

const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      company,
      location,
      salary,
      description,
      applyLink
    } = req.body;

    const existingJob = await prisma.job.findFirst({
      where: {
        id: Number(id),
        userId: req.user.userId
      }
    });

    if (!existingJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found."
      });
    }

    const updatedJob = await prisma.job.update({
      where: {
        id: Number(id)
      },
      data: {
        title,
        company,
        location,
        salary,
        description,
        applyLink
      }
    });

    return res.status(200).json({
      success: true,
      message: "Job updated successfully.",
      job: updatedJob
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const existingJob = await prisma.job.findFirst({
      where: {
        id: Number(id),
        userId: req.user.userId
      }
    });

    if (!existingJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found."
      });
    }

    await prisma.job.delete({
      where: {
        id: Number(id)
      }
    });

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully."
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
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob
};