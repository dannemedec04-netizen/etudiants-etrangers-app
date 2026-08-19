/*
  Warnings:

  - Added the required column `field` to the `Formation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `field` to the `JobOffer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Formation" ADD COLUMN     "field" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "JobOffer" ADD COLUMN     "field" TEXT NOT NULL;
