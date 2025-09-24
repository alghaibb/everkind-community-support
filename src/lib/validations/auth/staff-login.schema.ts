import { z } from "zod";
import { emailSchema, passwordSchema } from "../shared.schema";

export const staffLoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type StaffLoginFormValues = z.infer<typeof staffLoginSchema>;
