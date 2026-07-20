const prisma = require("../config/prisma");
const { fetchExternalJobs } = require("./jobApi.service");

// title + company + location, normalized, is the duplicate-detection key
// used by both the existing-jobs lookup and the freshly fetched API jobs.
const buildJobKey = (title, company, location) =>
  `${title}|${company}|${location}`.trim().toLowerCase();

// Single source of truth for "sync jobs for one user" — used by both the
// manual /api/jobs/sync endpoint and the cron scheduler, so the two never
// drift out of sync with each other. Never throws: any failure (API down,
// DB error) is caught, written as a FAILED SyncLog row, and returned as a
// normal result so callers don't need their own error-handling branch.
const syncJobsForUser = async (userId) => {
  const startedAt = new Date();

  try {
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

    const syncLog = await prisma.syncLog.create({
      data: {
        startedAt,
        finishedAt: new Date(),
        jobsAdded: added,
        duplicatesSkipped: duplicates,
        status: "SUCCESS",
        userId
      }
    });

    return { success: true, added, duplicates, syncLog };

  } catch (error) {
    console.error(`Sync Jobs Error (userId: ${userId}):`, error);

    const syncLog = await prisma.syncLog
      .create({
        data: {
          startedAt,
          finishedAt: new Date(),
          jobsAdded: 0,
          duplicatesSkipped: 0,
          status: "FAILED",
          errorMessage: error.message || "Unknown sync error",
          userId
        }
      })
      .catch((logError) => {
        console.error("Failed to write SyncLog entry:", logError);
        return null;
      });

    return {
      success: false,
      added: 0,
      duplicates: 0,
      message: error.message || "Failed to sync jobs from the job API.",
      syncLog
    };
  }
};

module.exports = { syncJobsForUser };
