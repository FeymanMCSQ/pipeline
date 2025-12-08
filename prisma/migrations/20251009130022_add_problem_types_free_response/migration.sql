-- CreateEnum
CREATE TYPE "public"."Stream" AS ENUM ('VC', 'CA');

-- CreateEnum
CREATE TYPE "public"."ProblemType" AS ENUM ('MCQ', 'NUMERIC', 'EXPRESSION', 'OPEN');

-- DropIndex
DROP INDEX "public"."Attempt_problemId_createdAt_idx";

-- DropIndex
DROP INDEX "public"."Problem_topic_rating_idx";

-- AlterTable
ALTER TABLE "public"."Attempt" ADD COLUMN     "freeResponse" TEXT,
ADD COLUMN     "normalized" TEXT,
ADD COLUMN     "score" DECIMAL(4,3),
ALTER COLUMN "chosen" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Problem" ADD COLUMN     "correctExpr" JSONB,
ADD COLUMN     "correctNumeric" JSONB,
ADD COLUMN     "openRubric" JSONB,
ADD COLUMN     "type" "public"."ProblemType" NOT NULL DEFAULT 'MCQ',
ALTER COLUMN "choices" DROP NOT NULL,
ALTER COLUMN "correctChoice" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."Archetype" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "stream" "public"."Stream" NOT NULL,
    "order" INTEGER NOT NULL,
    "summary" TEXT,

    CONSTRAINT "Archetype_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Archetype_slug_key" ON "public"."Archetype"("slug");

-- CreateIndex
CREATE INDEX "Attempt_problemId_idx" ON "public"."Attempt"("problemId");
