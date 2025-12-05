import { z } from "zod";
import { validateAustralianPhone, cleanPhoneNumber } from "@/lib/phone-utils";

// Constants
const ROLES = ["Support Worker", "Enrolled Nurse", "Registered Nurse"] as const;
const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

// Helper schemas
const requiredString = (message: string) => z.string().min(1, message);
const dayAvailability = z.object({
  am: z.boolean().default(false),
  pm: z.boolean().default(false),
}).default({ am: false, pm: false });

// Enhanced validation patterns
const WWCC_NUMBER_REGEX = /^[A-Z]{3}\d{7}[A-Z]$|^\d{8,12}$/; // Format: ABC1234567D or 12345678
const POLICE_CHECK_REGEX = /^\d{8,15}$/; // 8-15 digits
const AHPRA_REGEX = /^[A-Z]{3}\d{10}$/; // Format: ABC1234567890
const CERT3_REGEX = /^[A-Z]{2,4}\d{8,12}$|^[A-Z0-9]{8,15}$/; // Various certificate formats
const NDIS_CLEARANCE_REGEX = /^[A-Z0-9]{8,15}$/;

const validateComplianceNumber = (value: string, type: 'wwcc' | 'police' | 'ahpra' | 'cert3' | 'ndis') => {
  if (!value || value.trim() === '') return false;

  const cleaned = value.replace(/[\s\-]/g, '').toUpperCase();

  switch (type) {
    case 'wwcc':
      return WWCC_NUMBER_REGEX.test(cleaned);
    case 'police':
      return POLICE_CHECK_REGEX.test(cleaned);
    case 'ahpra':
      return AHPRA_REGEX.test(cleaned);
    case 'cert3':
      return CERT3_REGEX.test(cleaned);
    case 'ndis':
      return NDIS_CLEARANCE_REGEX.test(cleaned);
    default:
      return false;
  }
};

// Base schemas
export const roleSelectionSchema = z.object({
  role: z.enum(ROLES).optional(),
});

export const personalInfoSchema = z.object({
  firstName: z.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s\-']+$/, "First name can only contain letters, spaces, hyphens, and apostrophes"),
  lastName: z.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z\s\-']+$/, "Last name can only contain letters, spaces, hyphens, and apostrophes"),
  email: z.string()
    .email("Please enter a valid email address")
    .min(5, "Email address is too short")
    .max(100, "Email address is too long")
    .refine((email) => !email.includes('+'), "Temporary or disposable email addresses are not allowed"),
  phone: z.string()
    .min(10, "Phone number is too short")
    .max(20, "Phone number is too long")
    .refine(validateAustralianPhone, "Please enter a valid Australian phone number (e.g., 0412 345 678 or +61 412 345 678)")
    .transform(cleanPhoneNumber), // Store cleaned version in database
});

// Vaccination fields (shared between roles)
const vaccinationFields = {
  covidVaccinations: requiredString("COVID-19 vaccination status is required"),
  influenzaVaccination: requiredString("Influenza vaccination status is required"),
};

// Role-specific certification schemas
export const supportWorkerCertificationsSchema = z.object({
  cert3IndividualSupport: z.string()
    .min(1, "Certificate III in Individual Support number is required")
    .refine((val) => validateComplianceNumber(val, 'cert3'),
      "Please enter a valid Certificate III number (e.g., CHC33015123456 or ABC123456789)"),
  ...vaccinationFields,
});

export const nurseCertificationsSchema = z.object({
  ahpraRegistration: z.string()
    .min(1, "AHPRA registration number is required")
    .refine((val) => validateComplianceNumber(val, 'ahpra'),
      "Please enter a valid AHPRA registration number (e.g., NMW1234567890)"),
  ...vaccinationFields,
});

export const checksSchema = z.object({
  workingWithChildrenCheck: z.string()
    .min(1, "Working with Children Check number is required")
    .refine((val) => validateComplianceNumber(val, 'wwcc'),
      "Please enter a valid WWCC number (e.g., WWC1234567A or 12345678)"),
  ndisScreeningCheck: z.string()
    .min(1, "NDIS Screening Check number is required")
    .refine((val) => validateComplianceNumber(val, 'ndis'),
      "Please enter a valid NDIS clearance number"),
  policeCheck: z.string()
    .min(1, "Police Check number is required")
    .refine((val) => validateComplianceNumber(val, 'police'),
      "Please enter a valid Police Check reference number (8-15 digits)"),
  workingRights: z.enum(["Australian Citizen", "Permanent Resident", "Work Visa", "Other"], {
    message: "Please select your working rights status"
  }),
});

export const trainingExperienceSchema = z.object({
  ndisModules: z.enum(["Completed", "In Progress", "Not Started"], {
    message: "Please select your NDIS modules completion status"
  }),
  firstAidCPR: z.string()
    .min(1, "First Aid and CPR certification details are required")
    .min(8, "Please provide your certification number or details (minimum 8 characters)")
    .max(50, "Certification details are too long"),
  experience: z.string()
    .min(50, "Please provide a detailed description of your experience (minimum 50 characters)")
    .max(2000, "Experience description is too long (maximum 2000 characters)"),
  availability: z.object(
    Object.fromEntries(DAYS.map(day => [day, dayAvailability]))
  ).default(
    Object.fromEntries(DAYS.map(day => [day, { am: false, pm: false }]))
  ).refine((availability) => {
    const hasAnyAvailability = Object.values(availability).some(day => day.am || day.pm);
    return hasAnyAvailability;
  }, "Please select at least one available time slot"),
});

export const documentsSchema = z.object({
  resume: z.string().min(1, "Resume is required"),
  wwccDocument: z.string().optional(),
  ndisDocument: z.string().optional(),
  policeCheckDocument: z.string().optional(),
  firstAidCertificate: z.string().optional(),
  qualificationCertificate: z.string().optional(),
  ahpraCertificate: z.string().optional(),
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