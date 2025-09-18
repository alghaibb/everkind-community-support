import { z } from "zod";
import { emailSchema, passwordSchema } from "../shared.schema";

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  rememberMe: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;