/*
  Warnings:

  - You are about to drop the column `fulfilledWeightKg` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `totalWeightKg` on the `Contract` table. All the data in the column will be lost.
  - Added the required column `totalWeightPerKg` to the `Contract` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "fulfilledWeightKg",
DROP COLUMN "totalWeightKg",
ADD COLUMN     "fulfilledWeightPerKg" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalWeightPerKg" DOUBLE PRECISION NOT NULL;
