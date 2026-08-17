-- AlterTable
ALTER TABLE "CompanyInfo" ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];
