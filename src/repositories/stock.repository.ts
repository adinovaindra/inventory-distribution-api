import { Stock } from "@prisma/client";
import { prisma } from "../config/database";

export async function findAllStocksRepo(): Promise<Stock[]> {
  return prisma.stock.findMany({
    orderBy: {
      id: "asc",
    },
  });
}

export async function findStockByIdRepo(id: number): Promise<Stock | null> {
  return prisma.stock.findUnique({
    where: {
      id,
    },
  });
}

export async function checkStockByProductIdRepo(warehouseId: number, productId: number): Promise<Stock | null> {
  return prisma.stock.findUnique({
    where: {
      warehouseId_productId: {
        warehouseId,
        productId,
      },
    },
  });
}

export async function upsertStockRepo(warehouseId: number, productId: number, outputWeightPerKg: number): Promise<Stock> {
  return prisma.stock.upsert({
    where: {
      warehouseId_productId: {
        warehouseId,
        productId,
      },
    },
    update: {
      quantityPerKg: {
        increment: outputWeightPerKg,
      },
    },
    create: {
      warehouseId,
      productId,
      quantityPerKg: outputWeightPerKg,
    },
  });
}
