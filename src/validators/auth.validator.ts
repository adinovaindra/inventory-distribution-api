import { UserRole } from "@prisma/client";
import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name must be filled!"),
  email: z.email("Email is invalid!"),
  password: z
    .string()
    .min(8, "Password is too short. Minimum length is 8 characters"),
  role: z.enum(UserRole),
});

export type RegisterInput = z.infer<typeof registerSchema>;
