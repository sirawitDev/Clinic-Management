/*
  Warnings:

  - You are about to drop the `PromotionCourse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PromotionCourse" DROP CONSTRAINT "PromotionCourse_courseId_fkey";

-- DropForeignKey
ALTER TABLE "PromotionCourse" DROP CONSTRAINT "PromotionCourse_promotionId_fkey";

-- DropTable
DROP TABLE "PromotionCourse";
