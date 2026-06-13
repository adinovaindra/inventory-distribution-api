import { Prisma, RawMaterial, Stock, Warehouse } from "@prisma/client";
import { prisma } from "../config/database";

export async function findAllWarehouseRepo(): Promise<Warehouse[]> {
  return prisma.warehouse.findMany({
    orderBy: {
      id: "asc",
    },
  });
}

export async function findWarehouseByIdRepo(id: number): Promise<Warehouse | null> {
  return prisma.warehouse.findUnique({
    where: {
      id,
    },
  });
}

export async function checkStockAtWarehouse(warehouseId: number): Promise<Stock | null> {
  return prisma.stock.findFirst({
    where: {
      warehouseId,
      quantityPerKg: { gt: 0 },
    },
  });
}

export async function checkRawMaterialAtWarehouse(warehouseId: number): Promise<RawMaterial | null> {
  return prisma.rawMaterial.findFirst({
    where: {
      warehouseId: warehouseId,
      remainingWeightPerKg: { gt: 0 },
    },
  });
}

export async function createWarehouseRepo(warehouseData: Prisma.WarehouseCreateInput): Promise<Warehouse> {
  return prisma.warehouse.create({
    data: warehouseData,
  });
}

export async function updateWarehouseRepo(id: number, warehouseData: Prisma.WarehouseUpdateInput): Promise<Warehouse> {
  return prisma.warehouse.update({
    where: {
      id,
    },
    data: warehouseData,
  });
}

export async function deleteWarehouseRepo(id: number): Promise<Warehouse> {
  return prisma.warehouse.delete({
    where: {
      id,
    },
  });
}
