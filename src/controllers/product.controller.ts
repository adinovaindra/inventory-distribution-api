import { Request, Response } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../services/product.service";
import { successResponse } from "../utils/response";
import { BadRequestError } from "../utils/error";
import { createProductSchema, updateProductSchema } from "../validators/products.validator";
import { paginationSchema } from "../utils/pagination";

export async function getAllProductsController(req: Request, res: Response) {
  const {cursor, limit} = paginationSchema.parse(req.query)
  const {data, meta} = await getAllProducts(cursor, limit);
  res.status(200).json(successResponse("Successfully retrieve all products!", data, meta));
}

export async function getProductByIdController(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    throw new BadRequestError("id is invalid!");
  }

  const result = await getProductById(id);
  res.status(200).json(successResponse("Product is found!", result));
}

export async function createProductController(req: Request, res: Response) {
  const productData = createProductSchema.parse(req.body);
  const result = await createProduct(productData);

  res.status(201).json(successResponse(`${result.name} is successfully added!`, result));
}

export async function updateProductController(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    throw new BadRequestError("id is invalid!");
  }

  const productData = updateProductSchema.parse(req.body);

  const result = await updateProduct(id, productData);

  res.status(200).json(successResponse(`Product ${result.name} is updated!`, result));
}

export async function deleteProductController(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    throw new BadRequestError("id is invalid!");
  }

  const result = await deleteProduct(id);

  res.status(200).json(successResponse(`Product ${result.name} is successfully deleted!`));
}
