-- AlterTable
ALTER TABLE "ChecklistItem" ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "Aid" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "description" TEXT,
    "eligibility" TEXT,
    "amount" TEXT,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Aid_pkey" PRIMARY KEY ("id")
);
