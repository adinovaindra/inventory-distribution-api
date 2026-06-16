import { Stock } from "@prisma/client";
import { findAllStocksRepo, findStockByIdRepo } from "../repositories/stock.repository";
import { NotFoundError } from "../utils/error";

export async function getAllStocks(): Promise<Stock[]> {
  return findAllStocksRepo();
}

export async function getStockById(id: number): Promise<Stock> {
  const stock = await findStockByIdRepo(id);

  if (!stock) {
    throw new NotFoundError("Stock is not found!");
  }

  return stock;
}
