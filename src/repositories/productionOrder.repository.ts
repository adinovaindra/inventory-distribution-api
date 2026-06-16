import { Prisma, ProductionOrder, ProductionOrderStatus } from "@prisma/client";
import { prisma } from "../config/database";

export async function findAllProductionOrdersRepo(): Promise<ProductionOrder[]> {
  return prisma.productionOrder.findMany({
    orderBy: {
      id: "asc",
    },
  });
}

export async function findProductionOrderByIdRepo(id: number): Promise<ProductionOrder | null> {
  return prisma.productionOrder.findUnique({
    where: {
      id,
    },
  });
}

export async function addProductionOrderRepo(productionOrderData: Prisma.ProductionOrderUncheckedCreateInput): Promise<ProductionOrder> {
  return prisma.productionOrder.create({
    data: productionOrderData,
  });
}

export async function findInProgressProductionOrderRepo() {
  return prisma.productionOrder.findFirst({
    where: {
      status : "IN_PROGRESS"
    },
  });
}

export async function updateProductionOrderRepo(id: number, productionOrderData: Prisma.ProductionOrderUpdateInput): Promise<ProductionOrder> {
  return prisma.productionOrder.update({
    where: {
      id,
    },
    data: productionOrderData,
  });
}
