/*
  Warnings:

  - You are about to drop the column `notes` on the `Delivery` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Delivery" DROP COLUMN "notes",
ALTER COLUMN "status" SET DEFAULT 'PENDING';
