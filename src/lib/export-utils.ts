/**
 * Utility functions for exporting data to CSV format
 */

/**
 * Converts an array of objects to CSV format
 */
export function convertToCSV<T extends Record<string, unknown>>(
  data: T[],
  headers: { key: keyof T; label: string }[]
): string {
  if (data.length === 0) {
    return headers.map((h) => h.label).join(",");
  }

  // Create CSV header row
  const headerRow = headers.map((h) => escapeCSVValue(h.label)).join(",");

  // Create CSV data rows
  const dataRows = data.map((row) => {
    return headers
      .map((header) => {
        const value = row[header.key];
        return escapeCSVValue(formatCSVValue(value));
      })
      .join(",");
  });

  return [headerRow, ...dataRows].join("\n");
}

/**
 * Escapes CSV values that contain commas, quotes, or newlines
 */
function escapeCSVValue(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Formats a value for CSV export
 */
function formatCSVValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (Array.isArray(value)) {
    return value.join("; ");
  }

  if (typeof value === "object" && "toISOString" in value) {
    // Date object
    return (value as Date).toLocaleDateString("en-AU", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  return String(value);
}

/**
 * Downloads a CSV file
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Export participants to CSV
 */
export function exportParticipantsToCSV(participants: Array<{
  firstName: string;
  lastName: string;
  preferredName?: string;
  ndisNumber: string;
  status: string;
  dateOfBirth: string;
  email?: string;
  phone?: string;
  disabilities: string[];
  supportCoordinator?: string;
  planStartDate: string;
  planEndDate: string;
  planBudget?: number | null;
  createdAt: string;
}>): void {
  const headers = [
    { key: "firstName" as const, label: "First Name" },
    { key: "lastName" as const, label: "Last Name" },
    { key: "preferredName" as const, label: "Preferred Name" },
    { key: "ndisNumber" as const, label: "NDIS Number" },
    { key: "status" as const, label: "Status" },
    { key: "dateOfBirth" as const, label: "Date of Birth" },
    { key: "email" as const, label: "Email" },
    { key: "phone" as const, label: "Phone" },
    { key: "disabilities" as const, label: "Disabilities" },
    { key: "supportCoordinator" as const, label: "Support Coordinator" },
    { key: "planStartDate" as const, label: "Plan Start Date" },
    { key: "planEndDate" as const, label: "Plan End Date" },
    { key: "planBudget" as const, label: "Plan Budget" },
    { key: "createdAt" as const, label: "Created At" },
  ];

  const csv = convertToCSV(participants, headers);
  downloadCSV(csv, "participants");
}

/**
 * Export staff to CSV
 */
export function exportStaffToCSV(staff: Array<{
  user: { name: string; email: string };
  staffRole: string;
  employeeId?: string;
  isActive: boolean;
  phone?: string;
  startDate: string;
  ndisModules?: string[];
}>): void {
  const headers = [
    { key: "name" as const, label: "Name" },
    { key: "email" as const, label: "Email" },
    { key: "staffRole" as const, label: "Role" },
    { key: "employeeId" as const, label: "Employee ID" },
    { key: "isActive" as const, label: "Status" },
    { key: "phone" as const, label: "Phone" },
    { key: "startDate" as const, label: "Start Date" },
    { key: "ndisModules" as const, label: "NDIS Modules" },
  ];

  const data = staff.map((s) => ({
    name: s.user.name,
    email: s.user.email,
    staffRole: s.staffRole.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    employeeId: s.employeeId || "Not assigned",
    isActive: s.isActive ? "Active" : "Inactive",
    phone: s.phone || "",
    startDate: s.startDate,
    ndisModules: s.ndisModules || [],
  }));

  const csv = convertToCSV(data, headers);
  downloadCSV(csv, "staff");
}

/**
 * Export messages to CSV
 */
export function exportMessagesToCSV(messages: Array<{
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  createdAt: string;
}>): void {
  const headers = [
    { key: "firstName" as const, label: "First Name" },
    { key: "lastName" as const, label: "Last Name" },
    { key: "email" as const, label: "Email" },
    { key: "phone" as const, label: "Phone" },
    { key: "subject" as const, label: "Subject" },
    { key: "message" as const, label: "Message" },
    { key: "createdAt" as const, label: "Received At" },
  ];

  const csv = convertToCSV(messages, headers);
  downloadCSV(csv, "messages");
}

/**
 * Export career applications to CSV
 */
export function exportCareersToCSV(applications: Array<{
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  status?: string;
  experience: string;
  workingWithChildrenCheck?: string;
  ndisScreeningCheck?: string;
  policeCheck?: string;
  firstAidCPR?: string;
  createdAt: Date | string;
}>): void {
  const headers = [
    { key: "firstName" as const, label: "First Name" },
    { key: "lastName" as const, label: "Last Name" },
    { key: "email" as const, label: "Email" },
    { key: "phone" as const, label: "Phone" },
    { key: "role" as const, label: "Role" },
    { key: "status" as const, label: "Status" },
    { key: "experience" as const, label: "Experience" },
    { key: "workingWithChildrenCheck" as const, label: "Working with Children Check" },
    { key: "ndisScreeningCheck" as const, label: "NDIS Screening Check" },
    { key: "policeCheck" as const, label: "Police Check" },
    { key: "firstAidCPR" as const, label: "First Aid & CPR" },
    { key: "createdAt" as const, label: "Applied At" },
  ];

  const csv = convertToCSV(applications, headers);
  downloadCSV(csv, "career_applications");
}

