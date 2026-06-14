/*
  Warnings:

  - You are about to drop the column `totalWeightKg` on the `ProcurementOrder` table. All the data in the column will be lost.
  - Added the required column `totalWeightPerKg` to the `ProcurementOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProcurementOrder" DROP COLUMN "totalWeightKg",
ADD COLUMN     "totalWeightPerKg" DOUBLE PRECISION NOT NULL;
