import { z } from "zod";
import { nameSchema, emailSchema } from "./shared.schema";
import { validateAustralianPhone, cleanPhoneNumber } from "@/lib/phone-utils";

// Phone schema with Australian validation
const phoneSchema = z
  .string()
  .optional()
  .refine(
    (val) => !val || validateAustralianPhone(val),
    "Please enter a valid Australian phone number"
  )
  .transform((val) => (val ? cleanPhoneNumber(val) : val));

// NDIS Number validation (format: 4xxxxxxxxx)
const ndisNumberSchema = z
  .string()
  .min(1, "NDIS number is required")
  .regex(/^4\d{9}$/, "NDIS number must be 10 digits starting with 4")
  .refine((val) => {
    // Luhn algorithm validation for NDIS numbers
    const digits = val.split("").map(Number);
    let sum = 0;
    let alternate = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = digits[i];
      if (alternate) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      sum += digit;
      alternate = !alternate;
    }

    return sum % 10 === 0;
  }, "Invalid NDIS number checksum");

// Date of birth validation
const dateOfBirthSchema = z
  .string()
  .min(1, "Date of birth is required")
  .refine((val) => !isNaN(Date.parse(val)), "Please enter a valid date")
  .refine((val) => {
    const date = new Date(val);
    const now = new Date();
    const age = now.getFullYear() - date.getFullYear();
    return age >= 0 && age <= 120;
  }, "Please enter a valid date of birth");

// Budget validation
const budgetSchema = z
  .string()
  .optional()
  .refine(
    (val) =>
      !val ||
      (!isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 1000000),
    "Budget must be a positive number up to $1,000,000"
  );

// Array schemas for lists
const disabilitiesSchema = z
  .array(z.string().min(1, "Disability description cannot be empty"))
  .min(1, "At least one disability must be specified");
const medicationsSchema = z
  .array(z.string().min(1, "Medication name cannot be empty"))
  .optional()
  .default([]);
const allergiesSchema = z
  .array(z.string().min(1, "Allergy description cannot be empty"))
  .optional()
  .default([]);
const supportNeedsSchema = z
  .array(z.string().min(1, "Support need cannot be empty"))
  .min(1, "At least one support need must be specified");

// Participant status enum
const participantStatusSchema = z.enum(
  ["ACTIVE", "INACTIVE", "PENDING", "DISCHARGED"],
  {
    error: "Please select a valid participant status",
  }
);

// Create participant schema
export const createParticipantSchema = z.object({
  // Personal Information
  firstName: nameSchema,
  lastName: nameSchema,
  preferredName: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length >= 2,
      "Preferred name must be at least 2 characters"
    ),
  dateOfBirth: dateOfBirthSchema,
  gender: z.string().optional(),

  // Contact Information
  email: emailSchema.optional(),
  phone: phoneSchema,
  address: z.string().min(10, "Please provide a complete address"),
  emergencyContact: z.string().min(2, "Emergency contact name is required"),
  emergencyPhone: z
    .string()
    .min(1, "Emergency phone is required")
    .refine(
      (val) => !val || validateAustralianPhone(val),
      "Please enter a valid Australian phone number"
    )
    .transform((val) => (val ? cleanPhoneNumber(val) : val)),
  emergencyRelation: z
    .string()
    .min(2, "Emergency contact relationship is required"),

  // NDIS Information
  ndisNumber: ndisNumberSchema,
  planStartDate: z
    .string()
    .min(1, "Plan start date is required")
    .refine((val) => !isNaN(Date.parse(val)), "Please enter a valid date"),
  planEndDate: z
    .string()
    .min(1, "Plan end date is required")
    .refine((val) => !isNaN(Date.parse(val)), "Please enter a valid date"),
  planBudget: budgetSchema,
  planManager: z.string().optional(),
  supportCoordinator: z.string().optional(),

  // Medical Information
  disabilities: disabilitiesSchema,
  medications: medicationsSchema,
  allergies: allergiesSchema,
  medicalNotes: z.string().optional(),

  // Support Requirements
  supportNeeds: supportNeedsSchema,
  communicationMethod: z.string().optional(),
  behavioralNotes: z.string().optional(),

  // Status
  status: participantStatusSchema.default("ACTIVE"),
});

// Update participant schema (all fields optional for partial updates)
export const updateParticipantSchema = createParticipantSchema
  .partial()
  .extend({
    // ID is required for updates
    id: z.string().min(1, "Participant ID is required"),

    // NDIS number cannot be changed once set
    ndisNumber: z.string().optional(),
  });

// Search/filter schema
export const participantSearchSchema = z.object({
  search: z.string().optional(),
  status: participantStatusSchema.optional(),
  disability: z.string().optional(),
  supportCoordinator: z.string().optional(),
  planStartDateFrom: z.string().optional(),
  planStartDateTo: z.string().optional(),
});

export type CreateParticipantFormData = z.infer<typeof createParticipantSchema>;
export type UpdateParticipantFormData = z.infer<typeof updateParticipantSchema>;
export type ParticipantSearchFormData = z.infer<typeof participantSearchSchema>;
