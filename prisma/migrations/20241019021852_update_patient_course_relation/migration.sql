/*
  Warnings:

  - You are about to drop the column `patientId` on the `Course` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_patientId_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "patientId";

-- CreateTable
CREATE TABLE "PatientCourse" (
    "patientId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PatientCourse_pkey" PRIMARY KEY ("patientId","courseId")
);

-- AddForeignKey
ALTER TABLE "PatientCourse" ADD CONSTRAINT "PatientCourse_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientCourse" ADD CONSTRAINT "PatientCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
