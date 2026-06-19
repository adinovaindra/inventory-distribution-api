import { SalesOrderCustomerType } from "@prisma/client";
import z from "zod";

export const createSalesOrderSchema = z.object({
  contractId: z.number().int("ContractId must be filled correctly!").optional(),
  customerName: z.string().trim().min(1, "Customer name must be filled!"),
  customerType: z.enum(SalesOrderCustomerType, "Customer type can be only either BULOG, HOTEL, or RETAIL"),
  products: z
    .array(
      z.object({
        warehouseId: z.number().int(),
        productId: z.number().int(),
        quantityPerKg: z.number().int().min(25, "Minimum quantity is 25kg!"),
        pricePerKg: z.number().int().min(10000, "Please fill the price correctly!"),
      }),
    )
    .min(1, "At least one product is required!"),
});

export type CreateSalesOrderInput = z.infer<typeof createSalesOrderSchema>;

export const updateSalesOrderSchema = z.object({
  status: z.enum(["PROCESSING", "READY"], "Status can only be either PROCESSING or READY"),
});

export type UpdateSalesOrderInput = z.infer<typeof updateSalesOrderSchema>;
