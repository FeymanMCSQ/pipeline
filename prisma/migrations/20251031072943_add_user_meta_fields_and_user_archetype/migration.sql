-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "gold" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lessonsEntered" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "xp" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."UserArchetype" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "archetypeId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 400,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "lastPlayedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserArchetype_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserArchetype_archetypeId_idx" ON "public"."UserArchetype"("archetypeId");

-- CreateIndex
CREATE INDEX "UserArchetype_userId_idx" ON "public"."UserArchetype"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserArchetype_userId_archetypeId_key" ON "public"."UserArchetype"("userId", "archetypeId");

-- AddForeignKey
ALTER TABLE "public"."UserArchetype" ADD CONSTRAINT "UserArchetype_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserArchetype" ADD CONSTRAINT "UserArchetype_archetypeId_fkey" FOREIGN KEY ("archetypeId") REFERENCES "public"."Archetype"("id") ON DELETE CASCADE ON UPDATE CASCADE;
