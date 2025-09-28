import { z } from "zod";
import { validateAustralianPhone, cleanPhoneNumber } from "@/lib/phone-utils";
import { emailSchema } from "./shared.schema";

// Constants
const STAFF_ROLES = [
  "SUPPORT_WORKER",
  "ENROLLED_NURSE",
  "REGISTERED_NURSE",
  "COORDINATOR",
] as const;

// Enhanced validation patterns
const EMPLOYEE_ID_REGEX = /^[A-Z0-9]{3,10}$/;
const AHPRA_REGEX = /^[A-Z]{3}\d{10}$/; // Format: ABC1234567890
const CERT3_REGEX = /^[A-Z]{2,4}\d{8,12}$|^[A-Z0-9]{8,15}$/; // Various certificate formats

const validateComplianceNumber = (value: string, type: "ahpra" | "cert3") => {
  if (!value || value.trim() === "") return false;
  const cleaned = value.replace(/[\s\-]/g, "").toUpperCase();

  switch (type) {
    case "ahpra":
      return AHPRA_REGEX.test(cleaned);
    case "cert3":
      return CERT3_REGEX.test(cleaned);
    default:
      return false;
  }
};

// Base schemas
export const createStaffSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: emailSchema,
  role: z.enum(["STAFF", "ADMIN"], {
    error: "Please select a role",
  }),
  emailVerified: z.boolean(),
  sendWelcomeEmail: z.boolean(),
});

export const editStaffSchema = z.object({
  // Basic Information
  staffRole: z.enum(STAFF_ROLES, {
    error: "Please select a staff role",
  }),
  employeeId: z
    .string()
    .optional()
    .refine(
      (val) => !val || EMPLOYEE_ID_REGEX.test(val),
      "Employee ID must be 3-10 alphanumeric characters"
    ),
  startDate: z
    .string()
    .min(1, "Start date is required")
    .refine((val) => !isNaN(Date.parse(val)), "Please enter a valid date"),
  endDate: z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(Date.parse(val)),
      "Please enter a valid date"
    ),
  hourlyRate: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(Number(val)) && Number(val) > 0),
      "Hourly rate must be a positive number"
    ),

  // Contact Information
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || validateAustralianPhone(val),
      "Please enter a valid Australian phone number"
    )
    .transform((val) => (val ? cleanPhoneNumber(val) : val)),
  emergencyContact: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length >= 2,
      "Emergency contact name must be at least 2 characters"
    ),
  emergencyPhone: z
    .string()
    .optional()
    .refine(
      (val) => !val || validateAustralianPhone(val),
      "Please enter a valid Australian phone number"
    )
    .transform((val) => (val ? cleanPhoneNumber(val) : val)),
  address: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length >= 10,
      "Please provide a complete address"
    ),

  // Professional Qualifications
  ahpraRegistration: z
    .string()
    .optional()
    .refine(
      (val) => !val || validateComplianceNumber(val, "ahpra"),
      "Please enter a valid AHPRA registration number (e.g., NMW1234567890)"
    ),
  cert3IndividualSupport: z.boolean(),
  workingRights: z.boolean(),
  covidVaccinations: z.boolean(),
  influenzaVaccination: z.boolean(),
  workingWithChildrenCheck: z.boolean(),
  ndisScreeningCheck: z.boolean(),
  policeCheck: z.boolean(),
  firstAidCPR: z.boolean(),
  ndisModules: z.array(z.string()),
});

export const createStaffFromCareerSchema = z.object({
  staffRole: z.enum(STAFF_ROLES, {
    error: "Please select a staff role",
  }),
  startDate: z
    .string()
    .min(1, "Start date is required")
    .refine((val) => !isNaN(Date.parse(val)), "Please enter a valid date")
    .refine(
      (val) => new Date(val) >= new Date(new Date().setHours(0, 0, 0, 0)),
      "Start date cannot be in the past"
    ),
});

export type CreateStaffFormData = z.infer<typeof createStaffSchema>;
export type EditStaffFormData = z.infer<typeof editStaffSchema>;
export type CreateStaffFromCareerFormData = z.infer<
  typeof createStaffFromCareerSchema
>;
