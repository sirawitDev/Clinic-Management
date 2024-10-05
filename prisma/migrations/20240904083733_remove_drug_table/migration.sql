/*
  Warnings:

  - You are about to drop the column `drugId` on the `Prescription` table. All the data in the column will be lost.
  - You are about to drop the `Drug` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Prescription" DROP CONSTRAINT "Prescription_drugId_fkey";

-- AlterTable
ALTER TABLE "Prescription" DROP COLUMN "drugId";

-- DropTable
DROP TABLE "Drug";
