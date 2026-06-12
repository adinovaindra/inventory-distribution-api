import { ProductName } from "@prisma/client";
import { z } from "zod";

export const createProductSchema = z.object({
  name: z.enum(ProductName, `Product name must be filled with "DUA_KURMA", "STRAWBERRY", or "PRODUCTBULOG"`),
  description: z.string().trim().min(1).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export const updateProductSchema = createProductSchema.partial().refine((data) => {
  return Object.keys(data).length > 0;
}, "At least one data must be filled!");

export type UpdateProductInput = z.infer<typeof updateProductSchema>;
