import { z } from "zod";
import { emailSchema, passwordSchema } from "../shared.schema";

export const familyLoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type FamilyLoginFormValues = z.infer<typeof familyLoginSchema>;
