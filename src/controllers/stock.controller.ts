import { Request, Response } from "express";
import { getAllStocks, getStockById } from "../services/stock.service";
import { successResponse } from "../utils/response";
import { BadRequestError } from "../utils/error";
import { paginationSchema } from "../utils/pagination";

export async function getAllStocksController(req: Request, res: Response) {
  const { cursor, limit } = paginationSchema.parse(req.query);
  const { data, meta } = await getAllStocks(cursor, limit);
  res.status(200).json(successResponse("Successfully retrieve all stocks!", data, meta));
}

export async function getStockByIdController(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    throw new BadRequestError("Id is invalid!");
  }
  const result = await getStockById(id);
  res.status(200).json(successResponse("Stock is found!", result));
}
