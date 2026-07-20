const prisma = require("../config/prisma");
const { fetchExternalJobs } = require("../services/jobApi.service");

// title + company + location, normalized, is the duplicate-detection key
// used by both the existing-jobs lookup and the freshly fetched API jobs.
const buildJobKey = (title, company, location) =>
  `${title}|${company}|${location}`.trim().toLowerCase();

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
    const userId = req.user.userId;

    const [jobs, user] = await Promise.all([
      prisma.job.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" }
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { lastSyncedAt: true }
      })
    ]);

    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
      lastSyncedAt: user?.lastSyncedAt || null
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

const syncJobs = async (req, res) => {
  try {
    const userId = req.user.userId;

    const fetchedJobs = await fetchExternalJobs();

    const existingJobs = await prisma.job.findMany({
      where: { userId },
      select: { title: true, company: true, location: true }
    });

    const existingKeys = new Set(
      existingJobs.map((job) =>
        buildJobKey(job.title, job.company, job.location)
      )
    );

    let added = 0;
    let duplicates = 0;

    for (const job of fetchedJobs) {
      const key = buildJobKey(job.title, job.company, job.location);

      if (existingKeys.has(key)) {
        duplicates += 1;
        continue;
      }

      await prisma.job.create({
        data: {
          title: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary,
          description: job.description,
          applyLink: job.applyLink,
          source: job.source,
          userId
        }
      });

      existingKeys.add(key);
      added += 1;
    }

    await prisma.user.update({
      where: { id: userId },
      data: { lastSyncedAt: new Date() }
    });

    return res.status(200).json({
      success: true,
      added,
      duplicates
    });

  } catch (error) {
    console.error("Sync Jobs Error:", error);

    return res.status(502).json({
      success: false,
      message: error.message || "Failed to sync jobs from the job API."
    });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  syncJobs
};