/*
  Warnings:

  - A unique constraint covering the columns `[patient_cdnumber]` on the table `Diagnosis` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Diagnosis" ADD COLUMN     "patient_cdnumber" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Diagnosis_patient_cdnumber_key" ON "Diagnosis"("patient_cdnumber");
