-- AlterTable
ALTER TABLE "public"."Problem" ADD COLUMN     "attemptCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "attemptCount" INTEGER NOT NULL DEFAULT 0;
