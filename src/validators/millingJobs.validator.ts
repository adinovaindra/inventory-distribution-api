import { MillingJobStatus } from "@prisma/client";
import z from "zod";

export const createMillingJobSchema = z.object({
  customerName: z.string().trim().min(1, "Customer name must be filled!"),
  customerPhone: z
    .string()
    .trim()
    .refine((number) => {
      const phoneRegex = /^(?:08)[1-9][0-9]{7,10}$/;
      return phoneRegex.test(number);
    }, "Phone number format must be correct!(08XXX)")
    .optional(),
  inputWeightPerKg: z.number().min(100, "Minimum material to produced is 100kg!"),
});

export type CreateMillingJobInput = z.infer<typeof createMillingJobSchema>;

export const updateMillingJobSchema = z
  .object({
    status: z.enum(MillingJobStatus, "Status must be filled either IN_PROGRESS, COMPLETED, or CANCELLED!"),
    outputUtuhPerKg: z.number().min(1, "Please input the output correctly!").optional(),
    outputBrokenPerKg: z.number().min(1, "Please input the output correctly!").optional(),
    outputMenirPerKg: z.number().min(1, "Please input the output correctly!").optional(),
    outputRejectPerKg: z.number().min(1, "Please input the output correctly!").optional(),
    outputKatulPerKg: z.number().min(1, "Please input the output correctly!").optional(),
  })
  .refine((key) => {
    return Object.keys(key).length > 0;
  }, "At least one data must be filled!");

export type UpdateMillingJobInput = z.infer<typeof updateMillingJobSchema>;
