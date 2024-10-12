/*
  Warnings:

  - You are about to drop the column `productId` on the `Promotion` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Promotion" DROP CONSTRAINT "Promotion_productId_fkey";

-- AlterTable
ALTER TABLE "Promotion" DROP COLUMN "productId",
ADD COLUMN     "about" TEXT;
