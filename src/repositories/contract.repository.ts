import { Contract, Prisma } from "@prisma/client";
import { prisma } from "../config/database";
import { date } from "zod";
import { PaginationQuery } from "../utils/pagination";

export async function findAllContractsRepo(paginationQuery: PaginationQuery): Promise<Contract[]> {
  return prisma.contract.findMany({
    ...paginationQuery,
  });
}

export async function findContractByIdRepo(id: number): Promise<Contract | null> {
  return prisma.contract.findUnique({
    where: {
      id,
    },
  });
}

export async function findContractByEndDateRepo(): Promise<Contract[]> {
  return prisma.contract.findMany({
    where: {
      status: "ACTIVE",
      endDate: { lt: new Date() },
    },
  });
}

export async function addContractRepo(contractData: Prisma.ContractCreateInput): Promise<Contract> {
  return prisma.contract.create({
    data: contractData,
  });
}

export async function updateContractRepo(id: number, contractData: Prisma.ContractUpdateInput): Promise<Contract> {
  return prisma.contract.update({
    where: {
      id,
    },
    data: contractData,
  });
}
