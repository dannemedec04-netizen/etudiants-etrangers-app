/*
  Warnings:

  - Added the required column `category` to the `Aid` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Aid" ADD COLUMN     "category" TEXT NOT NULL;
