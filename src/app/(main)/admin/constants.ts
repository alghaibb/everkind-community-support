import {
  Heart,
  Stethoscope,
  GraduationCap,
  Users,
  LayoutDashboard,
  BarChart3,
  UserPlus,
  Activity,
  MessageSquare,
  Calendar,
  FileText
} from "lucide-react";

// Role definitions
export const ROLES = {
  SUPPORT_WORKER: "Support Worker",
  ENROLLED_NURSE: "Enrolled Nurse",
  REGISTERED_NURSE: "Registered Nurse",
  COORDINATOR: "Coordinator",
} as const;

// Role options for forms and filters
export const ROLE_OPTIONS = [
  { value: "all", label: "All Roles" },
  { value: ROLES.SUPPORT_WORKER, label: ROLES.SUPPORT_WORKER },
  { value: ROLES.ENROLLED_NURSE, label: ROLES.ENROLLED_NURSE },
  { value: ROLES.REGISTERED_NURSE, label: ROLES.REGISTERED_NURSE },
] as const;

// Staff role options for creating staff accounts
export const STAFF_ROLE_OPTIONS = [
  { value: "SUPPORT_WORKER", label: ROLES.SUPPORT_WORKER },
  { value: "ENROLLED_NURSE", label: ROLES.ENROLLED_NURSE },
  { value: "REGISTERED_NURSE", label: ROLES.REGISTERED_NURSE },
  { value: "COORDINATOR", label: ROLES.COORDINATOR },
] as const;

// Role icons mapping
export const ROLE_ICONS = {
  [ROLES.SUPPORT_WORKER]: Heart,
  [ROLES.ENROLLED_NURSE]: Stethoscope,
  [ROLES.REGISTERED_NURSE]: GraduationCap,
  [ROLES.COORDINATOR]: Users,
} as const;

// Role colors for badges and UI elements
export const ROLE_COLORS = {
  [ROLES.SUPPORT_WORKER]: "bg-pink-100 text-pink-800",
  [ROLES.ENROLLED_NURSE]: "bg-blue-100 text-blue-800",
  [ROLES.REGISTERED_NURSE]: "bg-green-100 text-green-800",
  [ROLES.COORDINATOR]: "bg-purple-100 text-purple-800",
} as const;

// Application status
export const APPLICATION_STATUS = {
  PENDING: "PENDING",
  REVIEWED: "REVIEWED",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
} as const;

// Status colors for badges
export const STATUS_COLORS = {
  [APPLICATION_STATUS.PENDING]: "bg-yellow-100 text-yellow-800",
  [APPLICATION_STATUS.REVIEWED]: "bg-blue-100 text-blue-800",
  [APPLICATION_STATUS.ACCEPTED]: "bg-green-100 text-green-800",
  [APPLICATION_STATUS.REJECTED]: "bg-red-100 text-red-800",
} as const;

// Status badge variants for Shadcn UI
export const STATUS_VARIANTS = {
  [APPLICATION_STATUS.PENDING]: "secondary" as const,
  [APPLICATION_STATUS.REVIEWED]: "secondary" as const,
  [APPLICATION_STATUS.ACCEPTED]: "default" as const,
  [APPLICATION_STATUS.REJECTED]: "destructive" as const,
} as const;

// Common icon sizes
export const ICON_SIZES = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-8 w-8",
} as const;

// Common spacing classes
export const SPACING = {
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
} as const;

// Compliance check labels
export const COMPLIANCE_CHECKS = {
  WWCC: "Working with Children Check",
  NDIS_SCREENING: "NDIS Screening Check",
  POLICE_CHECK: "Police Check",
  FIRST_AID: "First Aid/CPR",
  CERT3: "Cert III Individual Support",
  AHPRA: "AHPRA Registration",
} as const;

// Compliance check configuration
export const COMPLIANCE_CHECK_CONFIG = [
  {
    key: 'workingWithChildrenCheck',
    label: COMPLIANCE_CHECKS.WWCC,
    required: true,
  },
  {
    key: 'ndisScreeningCheck',
    label: COMPLIANCE_CHECKS.NDIS_SCREENING,
    required: true,
  },
  {
    key: 'policeCheck',
    label: COMPLIANCE_CHECKS.POLICE_CHECK,
    required: true,
  },
  {
    key: 'firstAidCPR',
    label: COMPLIANCE_CHECKS.FIRST_AID,
    required: true,
  },
  {
    key: 'cert3IndividualSupport',
    label: COMPLIANCE_CHECKS.CERT3,
    required: (role: string) => role === "Support Worker",
  },
  {
    key: 'ahpraRegistration',
    label: COMPLIANCE_CHECKS.AHPRA,
    required: (role: string) => role.includes("Nurse"),
    defaultValue: "N/A",
  },
] as const;

// Modal types for the modal system
export const MODAL_TYPES = {
  REJECT_APPLICATION: "reject-application",
  CREATE_STAFF: "create-staff",
  VIEW_APPLICATION: "view-application",
  DELETE_STAFF: "delete-staff",
  EDIT_STAFF: "edit-staff",
  VIEW_MESSAGE: "view-message",
  REPLY_MESSAGE: "reply-message",
  DELETE_CONTACT_MESSAGE: "delete-contact-message",
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
} as const;

// File upload limits
export const FILE_UPLOAD = {
  MAX_SIZE_MB: 10,
  ACCEPTED_TYPES: [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"],
} as const;

// Document download configuration
export const DOCUMENT_CONFIG = [
  { key: "resume", label: "Resume", required: true },
  { key: "wwccDocument", label: "WWCC" },
  { key: "ndisDocument", label: "NDIS" },
  { key: "policeCheckDocument", label: "Police Check" },
  { key: "firstAidCertificate", label: "First Aid" },
  { key: "qualificationCertificate", label: "Qualification" },
  { key: "ahpraCertificate", label: "AHPRA" },
] as const;

// Navigation items for admin sidebar
export const NAVIGATION_ITEMS = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/admin",
        icon: LayoutDashboard,
        description: "Main dashboard overview",
      },
      {
        title: "Analytics",
        url: "/admin/analytics",
        icon: BarChart3,
        description: "Performance metrics",
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Staff",
        url: "/admin/staff",
        icon: Users,
        description: "Manage team members",
      },
      {
        title: "Career Applications",
        url: "/admin/careers",
        icon: UserPlus,
        description: "Review job applications",
      },
      {
        title: "Participants",
        url: "/admin/participants",
        icon: Activity,
        description: "NDIS participants",
      },
      {
        title: "Messages",
        url: "/admin/messages",
        icon: MessageSquare,
        description: "Contact inquiries",
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        title: "Scheduling",
        url: "/admin/scheduling",
        icon: Calendar,
        description: "Staff schedules",
      },
      {
        title: "Reports",
        url: "/admin/reports",
        icon: FileText,
        description: "Generate reports",
      },
      {
        title: "Services",
        url: "/admin/services",
        icon: Heart,
        description: "Service management",
      },
    ],
  },
] as const;
