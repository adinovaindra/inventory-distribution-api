import { Stock } from "@prisma/client";
import { findAllStocksRepo, findStockByIdRepo } from "../repositories/stock.repository";
import { NotFoundError } from "../utils/error";
import { buildPaginationMeta, buildPaginationQuery } from "../utils/pagination";

export async function getAllStocks(cursor: number | undefined, limit: number) {
  const paginationQuery = buildPaginationQuery(cursor, limit);
  const allStocks = await findAllStocksRepo(paginationQuery);
  const paginationMeta = buildPaginationMeta(allStocks, limit);
  return {
    data: allStocks,
    meta: paginationMeta,
  };
}

export async function getStockById(id: number): Promise<Stock> {
  const stock = await findStockByIdRepo(id);

  if (!stock) {
    throw new NotFoundError("Stock is not found!");
  }

  return stock;
}
