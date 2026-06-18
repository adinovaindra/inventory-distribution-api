/*
  Warnings:

  - You are about to drop the column `OutputKatulPerKg` on the `MillingJob` table. All the data in the column will be lost.
  - You are about to drop the column `OutputMenirPerKg` on the `MillingJob` table. All the data in the column will be lost.
  - You are about to drop the column `OutputRejectPerKg` on the `MillingJob` table. All the data in the column will be lost.
  - You are about to drop the column `jobDate` on the `MillingJob` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "MillingJobStatus" ADD VALUE 'CANCELLED';

-- AlterTable
ALTER TABLE "MillingJob" DROP COLUMN "OutputKatulPerKg",
DROP COLUMN "OutputMenirPerKg",
DROP COLUMN "OutputRejectPerKg",
DROP COLUMN "jobDate",
ADD COLUMN     "outputKatulPerKg" DOUBLE PRECISION,
ADD COLUMN     "outputMenirPerKg" DOUBLE PRECISION,
ADD COLUMN     "outputRejectPerKg" DOUBLE PRECISION,
ALTER COLUMN "outputUtuhPerKg" DROP NOT NULL,
ALTER COLUMN "outputBrokenPerKg" DROP NOT NULL,
ALTER COLUMN "susutPerKg" DROP NOT NULL;
