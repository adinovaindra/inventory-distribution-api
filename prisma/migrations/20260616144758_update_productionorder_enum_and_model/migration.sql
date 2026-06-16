-- AlterEnum
ALTER TYPE "ProductionOrderStatus" ADD VALUE 'CANCELLED';

-- AlterTable
ALTER TABLE "ProductionOrder" ALTER COLUMN "outputWeightPerKg" DROP NOT NULL,
ALTER COLUMN "susutPerKg" DROP NOT NULL;
