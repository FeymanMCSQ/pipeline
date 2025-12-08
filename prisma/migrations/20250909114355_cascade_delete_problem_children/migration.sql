/*
  Warnings:

  - A unique constraint covering the columns `[promptLatex]` on the table `Problem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Attempt" DROP CONSTRAINT "Attempt_problemId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Attempt" DROP CONSTRAINT "Attempt_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RatingEvent" DROP CONSTRAINT "RatingEvent_problemId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RatingEvent" DROP CONSTRAINT "RatingEvent_userId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Problem_promptLatex_key" ON "public"."Problem"("promptLatex");

-- AddForeignKey
ALTER TABLE "public"."Attempt" ADD CONSTRAINT "Attempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Attempt" ADD CONSTRAINT "Attempt_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "public"."Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RatingEvent" ADD CONSTRAINT "RatingEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RatingEvent" ADD CONSTRAINT "RatingEvent_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "public"."Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
