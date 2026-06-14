import { ProcurementOrderStatus } from "@prisma/client";
import { z } from "zod";

export const createProcurementOrderSchema = z.object({
  supplierId: z.number().int().min(1, "SupplierId must be filled!"),
  contractId: z.number().int().min(1, "ContractId must be filled!").optional(),
  orderDate: z.iso.date("Date must be filled with YYYY-MM-DD format!"),
  totalWeightPerKg : z.number().min(10000, "Minimum weight must be 10000kg!"),
  pricePerKg: z.number().min(6000, "Please insert the correct price!"),
});

export type CreateProcurementOrderInput = z.infer<typeof createProcurementOrderSchema>;

export const updateProcurementOrderSchema = z.object({
  status: z.enum(ProcurementOrderStatus, "Status can only be PENDING, RECEIVED, or CANCELLED "),
  warehouseId : z.number().int().min(1, "WarehouseId must be filled!").optional()
});

export type UpdateProcurementOrderInput = z.infer<typeof updateProcurementOrderSchema>;
