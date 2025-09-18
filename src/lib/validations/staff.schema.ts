import { z } from "zod";

export const createStaffSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["STAFF", "ADMIN"], {
    error: "Please select a role",
  }),
  emailVerified: z.boolean(),
  sendWelcomeEmail: z.boolean(),
});

export const editStaffSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  role: z.enum(["STAFF", "ADMIN"], {
    error: "Please select a role",
  }),
  emailVerified: z.boolean(),
});

export type CreateStaffFormData = z.infer<typeof createStaffSchema>;
export type EditStaffFormData = z.infer<typeof editStaffSchema>;
