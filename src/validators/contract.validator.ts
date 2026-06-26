import { ContractStatus } from "@prisma/client";
import { z } from "zod";

// prettier-ignore
export const createContractSchema = z.object({
    contractNumber: z.string().trim().min(1, "Contract number must be filled!"),
    totalWeightPerKg: z.number().min(1000, "Minimum contract is 1000kg"),
    pricePerKg: z.number().min(6000, "Please insert the correct price!"),
    startDate: z.iso.date("Date must be filled with YYYY-MM-DD format"),
    endDate: z.iso.date("Date must be filled with YYYY-MM-DD format"),
  }).refine((data) => {
    return new Date(data.endDate) > new Date(data.startDate);
  }, "End date must be after start date!");

export type CreateContractInput = z.infer<typeof createContractSchema>;

export const updateContractSchema = z.object({
  status: z.enum(["COMPLETED", "CANCELLED"], "Contract status is either null or only can be either COMPLETED, or CANCELLED!"),
});

export type UpdateContractInput = z.infer<typeof updateContractSchema>;
