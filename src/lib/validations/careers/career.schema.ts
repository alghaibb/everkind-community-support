import { z } from "zod";

// Constants
const ROLES = ["Support Worker", "Enrolled Nurse", "Registered Nurse"] as const;
const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

// Helper schemas
const requiredString = (message: string) => z.string().min(1, message);
const dayAvailability = z.object({
  am: z.boolean().default(false),
  pm: z.boolean().default(false),
}).default({ am: false, pm: false });

// Base schemas
export const roleSelectionSchema = z.object({
  role: z.enum(ROLES),
});

export const personalInfoSchema = z.object({
  firstName: requiredString("First name is required"),
  lastName: requiredString("Last name is required"),
  email: z.email("Please enter a valid email address"),
  phone: requiredString("Phone number is required"),
});

// Vaccination fields (shared between roles)
const vaccinationFields = {
  covidVaccinations: requiredString("COVID-19 vaccination status is required"),
  influenzaVaccination: requiredString("Influenza vaccination status is required"),
};

// Role-specific certification schemas
export const supportWorkerCertificationsSchema = z.object({
  cert3IndividualSupport: requiredString("Certificate III in Individual Support is required"),
  ...vaccinationFields,
});

export const nurseCertificationsSchema = z.object({
  ahpraRegistration: requiredString("AHPRA registration number is required"),
  ...vaccinationFields,
});

export const checksSchema = z.object({
  workingWithChildrenCheck: requiredString("Working with Children Check is required"),
  ndisScreeningCheck: requiredString("NDIS Screening Check is required"),
  policeCheck: requiredString("Police Check is required"),
  workingRights: requiredString("Working rights information is required"),
});

export const trainingExperienceSchema = z.object({
  ndisModules: requiredString("NDIS modules completion is required"),
  firstAidCPR: requiredString("First Aid and CPR certification is required"),
  experience: requiredString("Please describe your relevant experience"),
  availability: z.object(
    Object.fromEntries(DAYS.map(day => [day, dayAvailability]))
  ).default(
    Object.fromEntries(DAYS.map(day => [day, { am: false, pm: false }]))
  ),
});

export const documentsSchema = z.object({
  resume: z.string().optional(),
  certificates: z.array(z.string()).optional(),
});

// Dynamic schema functions
/**
 * Returns the appropriate certification schema based on role
 * @param role - The selected role (Support Worker, Enrolled Nurse, or Registered Nurse)
 * @returns Zod schema for role-specific certifications
 */
export const getCertificationsSchema = (role: string) =>
  role === "Support Worker" ? supportWorkerCertificationsSchema : nurseCertificationsSchema;

/**
 * Returns complete career application schema based on role
 * @param role - The selected role
 * @returns Combined Zod schema with all required fields for the role
 */
export const getCareerSchema = (role: string) => {
  const certificationsSchema = getCertificationsSchema(role);
  return z.object({
    ...roleSelectionSchema.shape,
    ...personalInfoSchema.shape,
    ...certificationsSchema.shape,
    ...checksSchema.shape,
    ...trainingExperienceSchema.shape,
    ...documentsSchema.shape,
  });
};

// Types
export type RoleSelectionValues = z.infer<typeof roleSelectionSchema>;
export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;
export type SupportWorkerCertificationsValues = z.infer<typeof supportWorkerCertificationsSchema>;
export type NurseCertificationsValues = z.infer<typeof nurseCertificationsSchema>;
export type CertificationsValues = SupportWorkerCertificationsValues | NurseCertificationsValues;
export type ChecksValues = z.infer<typeof checksSchema>;
export type TrainingExperienceValues = z.infer<typeof trainingExperienceSchema>;
export type DocumentsValues = z.infer<typeof documentsSchema>;
export type CareerFormValues = z.infer<ReturnType<typeof getCareerSchema>>;