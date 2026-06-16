import { ProductionOrder } from "@prisma/client";
import { addProductionOrderRepo, findAllProductionOrdersRepo, findInProgressProductionOrderRepo, findProductionOrderByIdRepo, updateProductionOrderRepo } from "../repositories/productionOrder.repository";
import { BadRequestError, NotFoundError } from "../utils/error";
import { CreateProductionOrderInput, UpdateProductionOrderInput } from "../validators/productionOrder.validator";
import { UpdateRawMaterialRepo } from "../repositories/rawMaterial.repository";
import { upsertStockRepo } from "../repositories/stock.repository";
import { getRawMaterialById } from "./rawMaterial.service";
import { getProductById } from "./product.service";

export async function getAllProductionOrders(): Promise<ProductionOrder[]> {
  return findAllProductionOrdersRepo();
}

export async function getProductionOrderById(id: number): Promise<ProductionOrder> {
  const productionOrder = await findProductionOrderByIdRepo(id);
  if (!productionOrder) {
    throw new NotFoundError("Production order is not found!");
  }
  return productionOrder;
}

export async function createProductionOrder(productionOrderData: CreateProductionOrderInput): Promise<ProductionOrder> {
  await getProductById(productionOrderData.productId);

  const inProgressProductionOrder = await findInProgressProductionOrderRepo();

  const rawMaterial = await getRawMaterialById(productionOrderData.rawMaterialId);

  const newRemaining = rawMaterial.remainingWeightPerKg - productionOrderData.inputWeightPerKg;

  if (newRemaining < 0) {
    throw new BadRequestError("Insufficient Raw Material!");
  }

  await UpdateRawMaterialRepo(productionOrderData.rawMaterialId, newRemaining);

  if (inProgressProductionOrder) {
    return await addProductionOrderRepo({
      ...productionOrderData,
      status: "PENDING",
    });
  } else {
    return await addProductionOrderRepo({
      ...productionOrderData,
      status: "IN_PROGRESS",
    });
  }
}

export async function updateProductionOrder(id: number, productionOrderData: UpdateProductionOrderInput): Promise<ProductionOrder> {
  const dataToBeUpdated = await getProductionOrderById(id);
  if (dataToBeUpdated.status === "COMPLETED" || dataToBeUpdated.status === "CANCELLED") {
    throw new BadRequestError("Production order is already finalized and cannot be updated!");
  }

  if (productionOrderData.status === "COMPLETED") {
    if (!productionOrderData.outputWeightPerKg) {
      throw new BadRequestError("OutputWeightPerKg must be filled!");
    }

    const susutPerKg = dataToBeUpdated.inputWeightPerKg - productionOrderData.outputWeightPerKg;

    if (susutPerKg < 0 || susutPerKg > 0.2 * dataToBeUpdated.inputWeightPerKg) {
      throw new BadRequestError("OutputWeightPerKg cannot higher than InputWeightPerKg or less than 80%!");
    }

    const rawMaterial = await getRawMaterialById(dataToBeUpdated.rawMaterialId);

    await upsertStockRepo(rawMaterial.warehouseId, dataToBeUpdated.productId, productionOrderData.outputWeightPerKg);

    return updateProductionOrderRepo(id, {
      status: productionOrderData.status,
      outputWeightPerKg: productionOrderData.outputWeightPerKg,
      susutPerKg,
    });
  } else if (productionOrderData.status === "CANCELLED") {
    const rawMaterial = await getRawMaterialById(dataToBeUpdated.rawMaterialId);
    const restoredRemaining = rawMaterial.remainingWeightPerKg + dataToBeUpdated.inputWeightPerKg;
    await UpdateRawMaterialRepo(dataToBeUpdated.rawMaterialId, restoredRemaining);
    return updateProductionOrderRepo(id, {
      status: productionOrderData.status,
    });
  }

  return updateProductionOrderRepo(id, {
    status: productionOrderData.status,
  });
}
