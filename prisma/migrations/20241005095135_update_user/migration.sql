/*
  Warnings:

  - You are about to drop the column `city` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `Address` table. All the data in the column will be lost.
  - Added the required column `district` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `houseNumber` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subdistrict` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `village` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `postalCode` on the `Address` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "city",
DROP COLUMN "state",
DROP COLUMN "street",
ADD COLUMN     "district" TEXT NOT NULL,
ADD COLUMN     "houseNumber" INTEGER NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ADD COLUMN     "province" TEXT NOT NULL,
ADD COLUMN     "subdistrict" TEXT NOT NULL,
ADD COLUMN     "village" INTEGER NOT NULL,
DROP COLUMN "postalCode",
ADD COLUMN     "postalCode" INTEGER NOT NULL;
