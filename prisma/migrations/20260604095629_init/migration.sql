-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'WAREHOUSE_STAFF', 'DRIVER');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ProcurementOrderStatus" AS ENUM ('PENDING', 'RECEIVED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ProductionOrderStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "SupplierRegion" AS ENUM ('KEBUMEN', 'PONOROGO', 'DEMAK', 'WONOGIRI');

-- CreateEnum
CREATE TYPE "SalesOrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'READY', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('PENDING', 'DISPATCHED', 'DELIVERED');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('FUSO', 'COLT_DIESEL', 'PICKUP');

-- CreateEnum
CREATE TYPE "MillingJobStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "SalesOrderCustomerType" AS ENUM ('BULOG', 'HOTEL', 'RETAIL');

-- CreateEnum
CREATE TYPE "ProductName" AS ENUM ('DUA_KURMA', 'STRAWBERRY', 'PRODUCTBULOG');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "region" "SupplierRegion" NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" SERIAL NOT NULL,
    "contractNumber" TEXT NOT NULL,
    "totalWeightKg" DOUBLE PRECISION NOT NULL,
    "fulfilledWeightKg" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pricePerKg" DOUBLE PRECISION NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "ContractStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcurementOrder" (
    "id" SERIAL NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "contractId" INTEGER,
    "orderDate" TIMESTAMP(3) NOT NULL,
    "totalWeightKg" DOUBLE PRECISION NOT NULL,
    "pricePerKg" DOUBLE PRECISION NOT NULL,
    "status" "ProcurementOrderStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProcurementOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Warehouse" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "capacityPerKg" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Warehouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RawMaterial" (
    "id" SERIAL NOT NULL,
    "procurementOrderId" INTEGER NOT NULL,
    "warehouseId" INTEGER NOT NULL,
    "region" TEXT NOT NULL,
    "weightPerKg" DOUBLE PRECISION NOT NULL,
    "remainingWeightPerKg" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RawMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" "ProductName" NOT NULL,
    "description" TEXT,
    "unit" TEXT NOT NULL DEFAULT 'kg',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionOrder" (
    "id" SERIAL NOT NULL,
    "rawMaterialId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "inputWeightPerKg" DOUBLE PRECISION NOT NULL,
    "outputWeightPerKg" DOUBLE PRECISION NOT NULL,
    "susutPerKg" DOUBLE PRECISION NOT NULL,
    "productionDate" TIMESTAMP(3) NOT NULL,
    "status" "ProductionOrderStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductionOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionOrderWorker" (
    "id" SERIAL NOT NULL,
    "productionOrderId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ProductionOrderWorker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stock" (
    "id" SERIAL NOT NULL,
    "warehouseId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantityPerKg" DOUBLE PRECISION NOT NULL,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesOrder" (
    "id" SERIAL NOT NULL,
    "contractId" INTEGER,
    "customerName" TEXT NOT NULL,
    "customerType" "SalesOrderCustomerType" NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL,
    "status" "SalesOrderStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SalesOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesOrderProduct" (
    "id" SERIAL NOT NULL,
    "salesOrderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantityPerKg" DOUBLE PRECISION NOT NULL,
    "pricePerKg" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SalesOrderProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "plateNumber" TEXT NOT NULL,
    "type" "VehicleType" NOT NULL,
    "capacityPerKg" DOUBLE PRECISION NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Delivery" (
    "id" SERIAL NOT NULL,
    "salesOrderId" INTEGER NOT NULL,
    "driverId" INTEGER NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "status" "DeliveryStatus" NOT NULL,
    "departureTime" TIMESTAMP(3),
    "arrivalTime" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Delivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MillingJob" (
    "id" SERIAL NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT,
    "inputWeightPerKg" DOUBLE PRECISION NOT NULL,
    "outputUtuhPerKg" DOUBLE PRECISION NOT NULL,
    "outputBrokenPerKg" DOUBLE PRECISION NOT NULL,
    "OutputMenirPerKg" DOUBLE PRECISION NOT NULL,
    "OutputRejectPerKg" DOUBLE PRECISION NOT NULL,
    "OutputKatulPerKg" DOUBLE PRECISION NOT NULL,
    "susutPerKg" DOUBLE PRECISION NOT NULL,
    "jobDate" TIMESTAMP(3) NOT NULL,
    "status" "MillingJobStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MillingJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contract_contractNumber_key" ON "Contract"("contractNumber");

-- CreateIndex
CREATE UNIQUE INDEX "RawMaterial_procurementOrderId_key" ON "RawMaterial"("procurementOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductionOrderWorker_productionOrderId_userId_key" ON "ProductionOrderWorker"("productionOrderId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_warehouseId_productId_key" ON "Stock"("warehouseId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_plateNumber_key" ON "Vehicle"("plateNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Delivery_salesOrderId_key" ON "Delivery"("salesOrderId");

-- AddForeignKey
ALTER TABLE "ProcurementOrder" ADD CONSTRAINT "ProcurementOrder_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcurementOrder" ADD CONSTRAINT "ProcurementOrder_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawMaterial" ADD CONSTRAINT "RawMaterial_procurementOrderId_fkey" FOREIGN KEY ("procurementOrderId") REFERENCES "ProcurementOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawMaterial" ADD CONSTRAINT "RawMaterial_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionOrder" ADD CONSTRAINT "ProductionOrder_rawMaterialId_fkey" FOREIGN KEY ("rawMaterialId") REFERENCES "RawMaterial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionOrder" ADD CONSTRAINT "ProductionOrder_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionOrderWorker" ADD CONSTRAINT "ProductionOrderWorker_productionOrderId_fkey" FOREIGN KEY ("productionOrderId") REFERENCES "ProductionOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionOrderWorker" ADD CONSTRAINT "ProductionOrderWorker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesOrder" ADD CONSTRAINT "SalesOrder_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesOrderProduct" ADD CONSTRAINT "SalesOrderProduct_salesOrderId_fkey" FOREIGN KEY ("salesOrderId") REFERENCES "SalesOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesOrderProduct" ADD CONSTRAINT "SalesOrderProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_salesOrderId_fkey" FOREIGN KEY ("salesOrderId") REFERENCES "SalesOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
