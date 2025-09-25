import { Heart, Stethoscope, GraduationCap } from "lucide-react";

// Role configuration for career applications
export const CAREER_ROLES = [
  {
    value: "Support Worker",
    title: "Support Worker",
    description:
      "Provide essential support and assistance to individuals with disabilities in their daily activities and community participation.",
    icon: Heart,
    color: "bg-gradient-to-br from-pink-500 to-rose-600",
    features: [
      "Personal Care",
      "Community Access",
      "Life Skills",
      "Companionship",
    ],
    requirements: "Cert III Individual Support preferred",
    salary: "$28-35/hour",
  },
  {
    value: "Enrolled Nurse",
    title: "Enrolled Nurse",
    description:
      "Deliver nursing care under the supervision of registered nurses, focusing on medication management and health monitoring.",
    icon: Stethoscope,
    color: "bg-gradient-to-br from-blue-500 to-cyan-600",
    features: [
      "Medication Management",
      "Health Monitoring",
      "Clinical Care",
      "Documentation",
    ],
    requirements: "Diploma of Nursing (Enrolled)",
    salary: "$32-38/hour",
  },
  {
    value: "Registered Nurse",
    title: "Registered Nurse",
    description:
      "Provide comprehensive nursing care and clinical leadership, developing care plans and supervising other healthcare staff.",
    icon: GraduationCap,
    color: "bg-gradient-to-br from-emerald-500 to-teal-600",
    features: [
      "Clinical Leadership",
      "Care Planning",
      "Staff Supervision",
      "Complex Care",
    ],
    requirements: "Bachelor of Nursing + AHPRA Registration",
    salary: "$38-45/hour",
  },
] as const;

// Document field configuration for career applications
export const CAREER_DOCUMENT_FIELDS = [
  {
    key: "resume",
    label: "Resume/CV",
    description: "Your current resume or curriculum vitae",
    required: true,
    acceptedFormats: ".pdf,.doc,.docx",
    folder: "careers/resumes",
  },
  {
    key: "wwccDocument",
    label: "Working with Children Check",
    description: "Upload your WWCC certificate or clearance document",
    required: false,
    acceptedFormats: ".pdf,.jpg,.jpeg,.png",
    folder: "careers/wwcc",
  },
  {
    key: "ndisDocument",
    label: "NDIS Screening Check",
    description: "Upload your NDIS screening clearance document",
    required: false,
    acceptedFormats: ".pdf,.jpg,.jpeg,.png",
    folder: "careers/ndis",
  },
  {
    key: "policeCheckDocument",
    label: "Police Check",
    description: "Upload your National Police Certificate",
    required: false,
    acceptedFormats: ".pdf,.jpg,.jpeg,.png",
    folder: "careers/police",
  },
  {
    key: "firstAidCertificate",
    label: "First Aid & CPR Certificate",
    description: "Upload your current First Aid and CPR certification",
    required: false,
    acceptedFormats: ".pdf,.jpg,.jpeg,.png",
    folder: "careers/firstaid",
  },
  {
    key: "qualificationCertificate",
    label: "Qualification Certificate",
    description: "Upload your Cert III Individual Support or Nursing qualification",
    required: false,
    acceptedFormats: ".pdf,.jpg,.jpeg,.png",
    folder: "careers/qualifications",
  },
  {
    key: "ahpraCertificate",
    label: "AHPRA Registration",
    description: "Upload your AHPRA registration certificate (for nurses)",
    required: false,
    acceptedFormats: ".pdf,.jpg,.jpeg,.png",
    folder: "careers/ahpra",
  },
] as const;

// File upload configuration
export const FILE_UPLOAD_CONFIG = {
  maxSizeMB: 10,
  allowedTypes: {
    documents: ".pdf,.doc,.docx",
    images: ".jpg,.jpeg,.png",
    certificates: ".pdf,.jpg,.jpeg,.png",
  },
} as const;

// Availability configuration
export const AVAILABILITY_DAYS = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
] as const;

export const AVAILABILITY_PERIODS = [
  { key: "am", label: "Morning" },
  { key: "pm", label: "Afternoon" },
] as const;
