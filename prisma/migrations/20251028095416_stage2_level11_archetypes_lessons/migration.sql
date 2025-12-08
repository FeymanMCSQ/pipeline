/*
  Warnings:

  - A unique constraint covering the columns `[stream,order]` on the table `Archetype` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."LessonKind" AS ENUM ('HEURISTIC', 'WORKED_EXAMPLE', 'PRACTICE_GUIDE');

-- AlterTable
ALTER TABLE "public"."Archetype" ADD COLUMN     "eloMax" INTEGER NOT NULL DEFAULT 1900,
ADD COLUMN     "eloMin" INTEGER NOT NULL DEFAULT 400;

-- AlterTable
ALTER TABLE "public"."Problem" ADD COLUMN     "archetypeId" TEXT;

-- CreateTable
CREATE TABLE "public"."Lesson" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archetypeId" TEXT NOT NULL,
    "kind" "public"."LessonKind" NOT NULL,
    "title" TEXT NOT NULL,
    "bodyMarkdown" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Lesson_archetypeId_idx" ON "public"."Lesson"("archetypeId");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_archetypeId_order_key" ON "public"."Lesson"("archetypeId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Archetype_stream_order_key" ON "public"."Archetype"("stream", "order");

-- CreateIndex
CREATE INDEX "Problem_archetypeId_idx" ON "public"."Problem"("archetypeId");

-- AddForeignKey
ALTER TABLE "public"."Problem" ADD CONSTRAINT "Problem_archetypeId_fkey" FOREIGN KEY ("archetypeId") REFERENCES "public"."Archetype"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Lesson" ADD CONSTRAINT "Lesson_archetypeId_fkey" FOREIGN KEY ("archetypeId") REFERENCES "public"."Archetype"("id") ON DELETE CASCADE ON UPDATE CASCADE;
