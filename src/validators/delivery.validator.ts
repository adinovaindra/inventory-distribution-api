import z from "zod";

export const createDeliverySchema =  z.object({
    salesOrderId : z.number().int().min(1, "Sales Order ID must be filled!"),
    driverId : z.number().int().min(1, "Driver ID must be filled!"),
    vehicleId : z.number().int().min(1, "Vehicle ID must be filled!"),
})

export type CreateDeliveryInput = z.infer<typeof createDeliverySchema>

export const updateDeliverySchema = z.object({
    status : z.enum(["DISPATCHED", "DELIVERED"], "Status can only be either DISPATCHED or DELIVERED!")
})

export type UpdateDeliveryInput = z.infer<typeof updateDeliverySchema>