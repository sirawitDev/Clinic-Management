/*
  Warnings:

  - A unique constraint covering the columns `[cdnumber]` on the table `patients` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "patients_cdnumber_key" ON "patients"("cdnumber");
