-- AlterTable
ALTER TABLE "programs" ADD COLUMN     "image_urls" TEXT[] DEFAULT ARRAY[]::TEXT[];
