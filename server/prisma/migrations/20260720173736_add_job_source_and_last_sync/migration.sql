-- AlterTable
ALTER TABLE "public"."Job" ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'Manual';

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "lastSyncedAt" TIMESTAMP(3);
