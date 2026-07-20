const cron = require("node-cron");
const prisma = require("../config/prisma");
const { syncJobsForUser } = require("./jobSync.service");

const SYNC_INTERVAL_CRON = process.env.SYNC_INTERVAL_CRON || "0 */6 * * *";

// Every registered user gets their own sync run (and their own SyncLog row),
// mirroring how the manual "Sync Jobs" button scopes everything to one user.
const runScheduledSync = async () => {
  console.log(`[Scheduler] Running scheduled job sync (${new Date().toISOString()})`);

  try {
    const users = await prisma.user.findMany({ select: { id: true } });

    for (const user of users) {
      const result = await syncJobsForUser(user.id);

      if (!result.success) {
        console.error(`[Scheduler] Sync failed for user ${user.id}: ${result.message}`);
      }
    }

    console.log(`[Scheduler] Scheduled job sync completed for ${users.length} user(s).`);
  } catch (error) {
    // Defensive: even a failure in the users lookup itself must never crash
    // the process — the scheduler simply tries again on the next tick.
    console.error("[Scheduler] Scheduled sync run failed:", error);
  }
};

const startJobSyncScheduler = () => {
  if (!cron.validate(SYNC_INTERVAL_CRON)) {
    console.error(
      `[Scheduler] Invalid SYNC_INTERVAL_CRON expression "${SYNC_INTERVAL_CRON}". Scheduler not started.`
    );
    return;
  }

  cron.schedule(SYNC_INTERVAL_CRON, runScheduledSync);

  console.log(`[Scheduler] Job sync scheduler started (${SYNC_INTERVAL_CRON}).`);
};

module.exports = { startJobSyncScheduler };
