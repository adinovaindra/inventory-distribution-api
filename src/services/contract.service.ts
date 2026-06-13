import { Contract, Prisma } from "@prisma/client";
import { addContractRepo, findAllContractsRepo, findContractByIdRepo, updateContractRepo } from "../repositories/contract.repository";
import { BadRequestError, NotFoundError } from "../utils/error";
import { CreateContractInput, UpdateContractInput } from "../validators/contract.validator";

export async function getAllContracts(): Promise<Contract[]> {
  return findAllContractsRepo();
}

export async function getContractById(id: number): Promise<Contract> {
  const contract = await findContractByIdRepo(id);

  if (!contract) {
    throw new NotFoundError("Contract is not found!");
  }

  return contract;
}

export async function createContract(contractData: CreateContractInput): Promise<Contract> {
  try {
    return await addContractRepo({
      ...contractData,
      startDate: new Date(contractData.startDate),
      endDate: new Date(contractData.endDate),
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new BadRequestError("Contract is already inputed!");
    }
    throw error;
  }
}

export async function updateContract(id: number, contractData: UpdateContractInput): Promise<Contract> {
  try {
    return await updateContractRepo(id, contractData);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      throw new NotFoundError("Contract is not found!");
    }
    throw error;
  }
}
