import { z } from "zod";
import { emailSchema, passwordSchema, nameSchema } from "../shared.schema";

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: passwordSchema,
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});

export type RegisterFormValues = z.infer<typeof registerSchema>;