import { VehicleType } from "@prisma/client";
import z from "zod";

export const createVehicleSchema = z.object({
  plateNumber: z.string().regex(/^[A-Z]{1,2}\s\d{1,4}\s[A-Z]{0,3}$/, "Please input a correct number plate with UPPERCASE!"),
  type: z.enum(VehicleType, "Please input a correct vehicle type! (FUSO / COLT_DIESEL / PICKUP)"),
  capacityPerKg: z.number().int().min(1000, "Incorrect capacity. Minimum capacity is 1000 kg!"),
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;

export const updateVehicleSchema = createVehicleSchema
  .partial()
  .extend({
    isAvailable: z.boolean("The input can only be either true or false").optional(),
  })
  .refine((key) => {
    return Object.keys(key).length > 0;
  }, "At least one data must be filled!");

export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
