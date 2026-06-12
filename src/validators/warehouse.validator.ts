import { z } from "zod";

export const createWarehouseSchema = z.object({
  name: z.string().trim().min(1, "Warehouse name must be filled!"),
  location: z.string().trim().min(1, "Warehouse location must be filled!"),
  capacityPerKg: z.number().min(1, "Capacity must be filled with correct numeric"),
});

export type CreateWarehouseInput = z.infer<typeof createWarehouseSchema>;

export const updateWarehouseSchema = createWarehouseSchema.partial().refine((data) => {
  return Object.keys(data).length > 0;
}, "At least one field must be provided!");

export type UpdateWarehouseInput = z.infer<typeof updateWarehouseSchema>;
