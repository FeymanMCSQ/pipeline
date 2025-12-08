-- DropIndex
DROP INDEX "public"."Attempt_problemId_idx";

-- CreateIndex
CREATE INDEX "Attempt_problemId_createdAt_idx" ON "public"."Attempt"("problemId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Problem_topic_rating_idx" ON "public"."Problem"("topic", "rating");
