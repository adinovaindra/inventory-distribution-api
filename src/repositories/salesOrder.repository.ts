import { SalesOrder } from "@prisma/client";
import { prisma } from "../config/database";
import { CreateSalesOrderInput, UpdateSalesOrderInput } from "../validators/salesOrder.validator";

export async function findAllSalesOrdersRepo(): Promise<SalesOrder[]> {
  return prisma.salesOrder.findMany({
    orderBy: {
      id: "asc",
    },
  });
}

export async function findSalesOrderByIdRepo(id: number): Promise<SalesOrder | null> {
  return prisma.salesOrder.findUnique({
    where: {
      id,
    },
  });
}

export async function addSalesOrderRepo(salesOrderData: CreateSalesOrderInput): Promise<SalesOrder> {
  return prisma.$transaction(async (tx): Promise<SalesOrder> => {
    const { products, ...orderData } = salesOrderData;

    const salesOrder = await tx.salesOrder.create({
      data: {
        ...orderData,
        status: "PENDING",
        salesOrderProducts: {
          create: products.map(({ warehouseId, ...rest }) => {
            return rest;
          }),
        },
      },
      include: {
        salesOrderProducts: true,
      },
    });

    for (const list of products) {
      await tx.stock.update({
        where: {
          warehouseId_productId: {
            productId: list.productId,
            warehouseId: list.warehouseId,
          },
        },
        data: {
          quantityPerKg: {
            decrement: list.quantityPerKg,
          },
        },
      });
    }

    return salesOrder;
  });
}

export async function updateSalesOrderRepo(id: number, salesOrderData: UpdateSalesOrderInput): Promise<SalesOrder> {
  return prisma.salesOrder.update({
    where: {
      id,
    },
    data: salesOrderData,
  });
}
