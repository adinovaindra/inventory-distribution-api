import { Prisma, Product, ProductName } from "@prisma/client";
import { prisma } from "../config/database";

export async function findAllProductRepo(): Promise<Product[]> {
  return prisma.product.findMany({
    orderBy: {
      id: "asc",
    },
  });
}

export async function findProductById(id: number): Promise<Product | null> {
  return prisma.product.findUnique({
    where: {
      id
    },
  });
}

export async function findStockByProductId(id: number) {
  return prisma.stock.findFirst({
    where: {
      productId: id,
      quantityPerKg: { gt: 0 },
    },
  });
}

export async function addProductRepo(product: Prisma.ProductCreateInput): Promise<Product> {
  return prisma.product.create({
    data: product,
  });
}

export async function updateProductRepo(id: number, productData: Prisma.ProductUpdateInput): Promise<Product> {
  return prisma.product.update({
    where: {
      id,
    },
    data: productData,
  });
}

export async function deleteProductRepo(id: number): Promise<Product> {
  return prisma.product.delete({
    where: {
      id,
    },
  });
}
