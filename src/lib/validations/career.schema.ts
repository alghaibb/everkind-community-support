import { z } from "zod";

export const careerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(1, "Phone number is required"),

  // Certifications and Qualifications
  cert3IndividualSupport: z
    .string()
    .min(1, "Certificate III in Individual Support is required"),
  covidVaccinations: z
    .string()
    .min(1, "COVID-19 vaccination status is required"),
  influenzaVaccination: z
    .string()
    .min(1, "Influenza vaccination status is required"),

  // Checks and Clearances
  workingWithChildrenCheck: z
    .string()
    .min(1, "Working with Children Check is required"),
  ndisScreeningCheck: z.string().min(1, "NDIS Screening Check is required"),
  policeCheck: z.string().min(1, "Police Check is required"),
  workingRights: z.string().min(1, "Working rights information is required"),

  // Training and Modules
  ndisModules: z.string().min(1, "NDIS modules completion is required"),
  firstAidCPR: z.string().min(1, "First Aid and CPR certification is required"),

  // Additional Information
  experience: z.string().min(1, "Please describe your relevant experience"),
  availability: z.string().min(1, "Please specify your availability"),

  // File uploads (optional for now, can be required later)
  resume: z.string().optional(),
  certificates: z.string().optional(),
  references: z.string().optional(),
});

export type CareerFormValues = z.infer<typeof careerSchema>;
