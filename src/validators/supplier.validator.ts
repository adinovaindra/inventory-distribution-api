import { z } from "zod";
import { SupplierRegion } from "@prisma/client";

export const createSupplierSchema = z.object({
  name: z.string().trim().min(1, "Name must be filled!"),
  region: z.enum(SupplierRegion, "Region is not match with the options"),
  phone: z
    .string()
    .trim()
    .refine((number) => {
      const phoneRegex = /^(?:08)[1-9][0-9]{7,10}$/;
      return phoneRegex.test(number);
    }, "Phone number format must be correct!(08XXX)"),
  address: z.string().trim().min(1, "Address must be filled!"),
});

export type CreateSupplierInput = z.infer<typeof createSupplierSchema>;

export const updateSupplierSchema = createSupplierSchema.partial().refine((data) => {
  return Object.keys(data).length > 0;
}, "At least one field must be provided!");

export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>;
