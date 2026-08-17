-- CreateTable
CREATE TABLE "CompanyInfo" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "hotline" TEXT NOT NULL,
    "hotlineRaw" TEXT NOT NULL,
    "zaloUrl" TEXT NOT NULL,
    "whatsAppUrl" TEXT NOT NULL,
    "facebookUrl" TEXT NOT NULL,
    "googleMapsUrl" TEXT NOT NULL,
    "googleMapsEmbed" TEXT NOT NULL,
    "workingHours" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyInfo_pkey" PRIMARY KEY ("id")
);
