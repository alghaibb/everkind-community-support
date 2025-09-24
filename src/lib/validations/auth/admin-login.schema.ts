import { z } from "zod";
import { emailSchema, passwordSchema } from "../shared.schema";

export const adminLoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;
