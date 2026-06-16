import { prisma } from "../config/database";

export async function upsertStockRepo(warehouseId: number, productId: number, outputWeightPerKg: number) {
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
