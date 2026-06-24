import { Request, Response } from "express";
import { createContract, getAllContracts, getContractById, updateContract } from "../services/contract.service";
import { successResponse } from "../utils/response";
import { BadRequestError } from "../utils/error";
import { createContractSchema, updateContractSchema } from "../validators/contract.validator";
import { paginationSchema } from "../utils/pagination";

export async function getAllContractsController(req: Request, res: Response) {
  const { cursor, limit } = paginationSchema.parse(req.query);
  const { data, meta } = await getAllContracts(cursor, limit);
  res.status(200).json(successResponse("Successfully retrieve all contracts!", data, meta));
}

export async function getContractByIdController(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    throw new BadRequestError("Id is invalid!");
  }

  const result = await getContractById(id);
  res.status(200).json(successResponse("Contract is found!", result));
}

export async function createContractController(req: Request, res: Response) {
  const contractData = createContractSchema.parse(req.body);
  const result = await createContract(contractData);
  res.status(201).json(successResponse("Contract is created!", result));
}

export async function updateContractController(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    throw new BadRequestError("Id is invalid");
  }

  const contractData = updateContractSchema.parse(req.body);
  const result = await updateContract(id, contractData);
  res.status(200).json(successResponse(`Contract status with contract number ${result.contractNumber} is ${result.status}`));
}
