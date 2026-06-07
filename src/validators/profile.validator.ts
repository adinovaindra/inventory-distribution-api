import { z } from "zod"

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, "Name must be filled!").optional(),
  password: z
    .string()
    .min(8, "Password is too short. Minimum length is 8 characters").optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>