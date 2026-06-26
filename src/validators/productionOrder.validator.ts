import { ProductionOrderStatus } from "@prisma/client";
import z from "zod";

export const createProductionOrderSchema = z.object({
  rawMaterialId: z.number().int().min(1, "RawMaterialId must be filled!"), // 6
  productId: z.number().int().min(1, "ProductId must be filled!"), // 1
  inputWeightPerKg: z.number().min(100, "Minimum material to produced is 100kg!"),
});

export type CreateProductionOrderInput = z.infer<typeof createProductionOrderSchema>;

export const updateProductionOrderSchema = z.object({
  outputWeightPerKg: z.number().min(1, "Please input the output correctly!").optional(),
  status: z.enum(["IN_PROGRESS", "COMPLETED", "CANCELLED"], "Status only can be either IN_PROGRESS, COMPLETED, or CANCELLED!"),
});

export type UpdateProductionOrderInput = z.infer<typeof updateProductionOrderSchema>;
