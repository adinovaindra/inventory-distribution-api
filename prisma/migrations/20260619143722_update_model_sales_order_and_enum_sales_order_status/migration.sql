/*
  Warnings:

  - The values [CANCELLED] on the enum `SalesOrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `orderDate` on the `SalesOrder` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SalesOrderStatus_new" AS ENUM ('PENDING', 'PROCESSING', 'READY', 'DELIVERED');
ALTER TABLE "SalesOrder" ALTER COLUMN "status" TYPE "SalesOrderStatus_new" USING ("status"::text::"SalesOrderStatus_new");
ALTER TYPE "SalesOrderStatus" RENAME TO "SalesOrderStatus_old";
ALTER TYPE "SalesOrderStatus_new" RENAME TO "SalesOrderStatus";
DROP TYPE "SalesOrderStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "SalesOrder" DROP COLUMN "orderDate",
ALTER COLUMN "status" SET DEFAULT 'PENDING';
