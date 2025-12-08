-- AlterTable
ALTER TABLE "public"."Archetype" ADD COLUMN     "domainId" TEXT;

-- CreateTable
CREATE TABLE "public"."Subject" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 1,
    "summary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Domain" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 1,
    "summary" TEXT,
    "subjectId" TEXT NOT NULL,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subject_slug_key" ON "public"."Subject"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Domain_slug_key" ON "public"."Domain"("slug");

-- CreateIndex
CREATE INDEX "Domain_subjectId_idx" ON "public"."Domain"("subjectId");

-- CreateIndex
CREATE INDEX "Archetype_domainId_idx" ON "public"."Archetype"("domainId");

-- AddForeignKey
ALTER TABLE "public"."Archetype" ADD CONSTRAINT "Archetype_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "public"."Domain"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Domain" ADD CONSTRAINT "Domain_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "public"."Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
