import {
  LayoutDashboard,
  Calendar,
  CalendarPlus,
  Users,
  ClipboardList,
  Clock,
  UserCircle,
  Bell,
} from "lucide-react";

// Navigation items for staff sidebar
export const STAFF_NAVIGATION_ITEMS = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/staff",
        icon: LayoutDashboard,
        description: "Your dashboard overview",
      },
      {
        title: "Notifications",
        url: "/staff/notifications",
        icon: Bell,
        description: "View notifications",
      },
    ],
  },
  {
    title: "Schedule",
    items: [
      {
        title: "My Schedule",
        url: "/staff/schedule",
        icon: Calendar,
        description: "View your shifts",
      },
      {
        title: "Available Shifts",
        url: "/staff/available-shifts",
        icon: CalendarPlus,
        description: "Browse open shifts",
      },
      {
        title: "Appointments",
        url: "/staff/appointments",
        icon: Clock,
        description: "Upcoming appointments",
      },
    ],
  },
  {
    title: "Work",
    items: [
      {
        title: "My Participants",
        url: "/staff/participants",
        icon: Users,
        description: "Assigned participants",
      },
      {
        title: "Timesheets",
        url: "/staff/timesheets",
        icon: ClipboardList,
        description: "Log your hours",
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "My Profile",
        url: "/staff/profile",
        icon: UserCircle,
        description: "Your profile & settings",
      },
    ],
  },
] as const;

// Shift status labels and colors
export const SHIFT_STATUS = {
  SCHEDULED: { label: "Scheduled", variant: "secondary" as const },
  COMPLETED: { label: "Completed", variant: "success" as const },
  CANCELLED: { label: "Cancelled", variant: "destructive" as const },
  NO_SHOW: { label: "No Show", variant: "destructive" as const },
} as const;

// Request status labels and colors
export const REQUEST_STATUS = {
  PENDING: { label: "Pending", variant: "warning" as const },
  APPROVED: { label: "Approved", variant: "success" as const },
  REJECTED: { label: "Rejected", variant: "destructive" as const },
} as const;

// Timesheet status labels and colors
export const TIMESHEET_STATUS = {
  DRAFT: { label: "Draft", variant: "secondary" as const },
  SUBMITTED: { label: "Submitted", variant: "warning" as const },
  APPROVED: { label: "Approved", variant: "success" as const },
  REJECTED: { label: "Rejected", variant: "destructive" as const },
} as const;

// Service types for timesheets
export const SERVICE_TYPES = [
  { value: "personal_care", label: "Personal Care Support" },
  { value: "community_access", label: "Community Access" },
  { value: "domestic_assistance", label: "Domestic Assistance" },
  { value: "social_support", label: "Social Support" },
  { value: "transport", label: "Transport" },
  { value: "nursing", label: "Nursing Care" },
  { value: "therapy", label: "Therapeutic Support" },
  { value: "respite", label: "Respite Care" },
  { value: "other", label: "Other" },
] as const;

// Modal types for staff dashboard
export const STAFF_MODAL_TYPES = {
  REQUEST_SHIFT: "request-shift",
  VIEW_SHIFT: "view-shift",
  CANCEL_SHIFT_REQUEST: "cancel-shift-request",
  CREATE_TIMESHEET: "create-timesheet",
  EDIT_TIMESHEET: "edit-timesheet",
  VIEW_TIMESHEET: "view-timesheet",
  VIEW_PARTICIPANT: "view-participant",
  VIEW_APPOINTMENT: "view-appointment",
  CHECK_IN: "check-in",
  CHECK_OUT: "check-out",
} as const;
