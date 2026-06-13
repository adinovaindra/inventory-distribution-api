import { Contract, Prisma } from "@prisma/client";
import { prisma } from "../config/database";

export async function findAllContractsRepo(): Promise<Contract[]> {
  return prisma.contract.findMany({
    orderBy: {
      id: "asc",
    },
  });
}

export async function findContractByIdRepo(id: number): Promise<Contract | null> {
  return prisma.contract.findUnique({
    where: {
      id,
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
