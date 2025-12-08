-- AlterTable
ALTER TABLE "public"."Problem" ADD COLUMN     "requireForm" TEXT[] DEFAULT ARRAY[]::TEXT[];
