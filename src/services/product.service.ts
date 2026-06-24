import { Prisma, Product } from "@prisma/client";
import { addProductRepo, deleteProductRepo, findAllProductRepo, findProductById, findStockByProductId, updateProductRepo } from "../repositories/product.repository";
import { BadRequestError, NotFoundError } from "../utils/error";
import { CreateProductInput, UpdateProductInput } from "../validators/products.validator";
import { buildPaginationMeta, buildPaginationQuery } from "../utils/pagination";

export async function getAllProducts(cursor: number | undefined, limit: number) {
  const paginationQuery = buildPaginationQuery(cursor, limit);
  const allProducts = await findAllProductRepo(paginationQuery);
  const paginationMeta = buildPaginationMeta(allProducts, limit);
  return {
    data: allProducts,
    meta: paginationMeta,
  };
}

export async function getProductById(id: number): Promise<Product> {
  const product = await findProductById(id);

  if (!product) {
    throw new NotFoundError("Product is not found!");
  }

  return product;
}

export async function verifyStockProductById(productId: number) {
  const stockProduct = await findStockByProductId(productId);

  if (stockProduct) {
    throw new BadRequestError("Cannot delete product with existing stock!");
  }
}

export async function createProduct(productData: CreateProductInput): Promise<Product> {
  try {
    return await addProductRepo(productData);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new BadRequestError("Product is already listed!");
    }
    throw error;
  }
}

export async function updateProduct(id: number, productData: UpdateProductInput): Promise<Product> {
  try {
    return await updateProductRepo(id, productData);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new NotFoundError("Product is not found!");
      }
      if (error.code === "P2002") {
        throw new BadRequestError("Product is already listed!");
      }
    }
    throw error;
  }
}

export async function deleteProduct(id: number) {
  await getProductById(id);
  await verifyStockProductById(id);
  return await deleteProductRepo(id);
}
