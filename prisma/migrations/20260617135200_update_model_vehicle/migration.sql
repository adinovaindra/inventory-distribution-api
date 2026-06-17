/*
  Warnings:

  - You are about to alter the column `capacityPerKg` on the `Vehicle` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Vehicle" ALTER COLUMN "capacityPerKg" SET DATA TYPE INTEGER;
