-- DropForeignKey
ALTER TABLE "public"."Attempt" DROP CONSTRAINT "Attempt_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Attempt" ADD COLUMN     "guestId" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Attempt_userId_idx" ON "public"."Attempt"("userId");

-- CreateIndex
CREATE INDEX "Attempt_guestId_idx" ON "public"."Attempt"("guestId");

-- CreateIndex
CREATE INDEX "Attempt_problemId_idx" ON "public"."Attempt"("problemId");

-- CreateIndex
CREATE INDEX "Problem_rating_idx" ON "public"."Problem"("rating");

-- AddForeignKey
ALTER TABLE "public"."Attempt" ADD CONSTRAINT "Attempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
