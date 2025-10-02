import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  DashboardStats,
  CareerApplicationsResponse,
  CareerApplicationsApiResponse,
  ContactMessagesResponse,
  ContactMessagesApiResponse,
  StaffResponse,
  ParticipantsResponse,
  UsersResponse,
} from "@/types/admin";
import { ApplicationStatus } from "@/generated/prisma";
import { env } from "@/lib/env";

export const adminQueryKeys = {
  all: ["admin"] as const,
  dashboard: () => [...adminQueryKeys.all, "dashboard"] as const,
  careers: () => [...adminQueryKeys.all, "careers"] as const,
  careersList: (params: { search?: string; role?: string; page?: number }) =>
    [
      ...adminQueryKeys.careers(),
      "list",
      {
        search: params.search || undefined,
        role: params.role || undefined,
        page: params.page || 1,
      },
    ] as const,
  careerDetails: (id: string) =>
    [...adminQueryKeys.careers(), "detail", id] as const,
  messages: () => [...adminQueryKeys.all, "messages"] as const,
  messagesList: (params: { search?: string; page?: number }) =>
    [
      ...adminQueryKeys.messages(),
      "list",
      {
        search: params.search || undefined,
        page: params.page || 1,
      },
    ] as const,
  staff: () => [...adminQueryKeys.all, "staff"] as const,
  staffList: (params: { search?: string; role?: string; page?: number }) =>
    [...adminQueryKeys.staff(), "list", params] as const,
  participants: () => [...adminQueryKeys.all, "participants"] as const,
  participantsList: (params: {
    search?: string;
    status?: string;
    disability?: string;
    supportCoordinator?: string;
  }) => [...adminQueryKeys.participants(), "list", params] as const,
  analytics: () => [...adminQueryKeys.all, "analytics"] as const,
  users: () => [...adminQueryKeys.all, "users"] as const,
  usersList: (params: {
    search?: string;
    role?: string;
    userType?: string;
    status?: string;
  }) => [...adminQueryKeys.users(), "list", params] as const,
} as const;

// Helper function to get base URL for fetch requests
function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return env.NEXT_PUBLIC_BASE_URL;
}

async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await fetch(`${getBaseUrl()}/api/admin/dashboard`);
  if (!response.ok) {
    throw new Error("Failed to fetch dashboard stats");
  }
  return response.json();
}

async function fetchCareerApplications(params: {
  search?: string;
  role?: string;
  page?: number;
}): Promise<CareerApplicationsResponse> {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set("search", params.search);
  if (params.role) searchParams.set("role", params.role);
  if (params.page) searchParams.set("page", params.page.toString());

  const response = await fetch(
    `${getBaseUrl()}/api/admin/careers?${searchParams}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch career applications");
  }
  const data: CareerApplicationsApiResponse = await response.json();

  // Transform string dates to Date objects and handle nulls
  return {
    ...data,
    applications: data.applications.map((app) => ({
      ...app,
      createdAt: new Date(app.createdAt),
      cert3IndividualSupport: app.cert3IndividualSupport || "",
      workingWithChildrenCheck: app.workingWithChildrenCheck || "",
      ndisScreeningCheck: app.ndisScreeningCheck || "",
      policeCheck: app.policeCheck || "",
      firstAidCPR: app.firstAidCPR || "",
      rejectedAt: app.rejectedAt ? new Date(app.rejectedAt) : null,
      status: app.status as ApplicationStatus | undefined,
    })),
  };
}

async function fetchContactMessages(params: {
  search?: string;
  page?: number;
}): Promise<ContactMessagesResponse> {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set("search", params.search);
  if (params.page) searchParams.set("page", params.page.toString());

  const response = await fetch(
    `${getBaseUrl()}/api/admin/messages?${searchParams}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch contact messages");
  }
  const data: ContactMessagesApiResponse = await response.json();

  // Transform string dates to Date objects
  return {
    ...data,
    messages: data.messages.map((message) => ({
      ...message,
      createdAt: new Date(message.createdAt),
    })),
  };
}

// Query hooks
export function useDashboardStats() {
  return useQuery({
    queryKey: adminQueryKeys.dashboard(),
    queryFn: fetchDashboardStats,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDashboardStatsSuspense() {
  return useSuspenseQuery({
    queryKey: adminQueryKeys.dashboard(),
    queryFn: fetchDashboardStats,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useCareerApplications(params: {
  search?: string;
  role?: string;
  page?: number;
}) {
  return useQuery({
    queryKey: adminQueryKeys.careersList(params),
    queryFn: () => fetchCareerApplications(params),
    staleTime: 2 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}

export function useCareerApplicationsSuspense(params: {
  search?: string;
  role?: string;
  page?: number;
}) {
  return useQuery({
    queryKey: adminQueryKeys.careersList(params),
    queryFn: () => fetchCareerApplications(params),
    staleTime: 2 * 60 * 1000,
    retry: false,
  });
}

export function useContactMessages(params: { search?: string; page?: number }) {
  return useQuery({
    queryKey: adminQueryKeys.messagesList(params),
    queryFn: () => fetchContactMessages(params),
    staleTime: 2 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}

export function useContactMessagesSuspense(params: {
  search?: string;
  page?: number;
}) {
  return useSuspenseQuery({
    queryKey: adminQueryKeys.messagesList(params),
    queryFn: () => fetchContactMessages(params),
    staleTime: 2 * 60 * 1000,
    retry: false,
  });
}

// Staff queries
async function fetchStaff(params: {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
}): Promise<StaffResponse> {
  const searchParams = new URLSearchParams();

  if (params.search) searchParams.set("search", params.search);
  if (params.role) searchParams.set("role", params.role);
  if (params.status) searchParams.set("status", params.status);
  if (params.page) searchParams.set("page", params.page.toString());

  const response = await fetch(
    `${getBaseUrl()}/api/admin/staff?${searchParams.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch staff");
  }

  return response.json();
}

export function useStaffList(params: {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
}) {
  return useQuery({
    queryKey: adminQueryKeys.staffList(params),
    queryFn: () => fetchStaff(params),
    staleTime: 2 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}

// Participants queries
async function fetchParticipants(params: {
  search?: string;
  status?: string;
  disability?: string;
  supportCoordinator?: string;
}): Promise<ParticipantsResponse> {
  const searchParams = new URLSearchParams();

  if (params.search) searchParams.set("search", params.search);
  if (params.status) searchParams.set("status", params.status);
  if (params.disability) searchParams.set("disability", params.disability);
  if (params.supportCoordinator)
    searchParams.set("supportCoordinator", params.supportCoordinator);

  const response = await fetch(
    `${getBaseUrl()}/api/admin/participants?${searchParams.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch participants");
  }

  return response.json();
}

export function useParticipantsList(params: {
  search?: string;
  status?: string;
  disability?: string;
  supportCoordinator?: string;
}) {
  return useQuery({
    queryKey: adminQueryKeys.participantsList(params),
    queryFn: () => fetchParticipants(params),
    staleTime: 2 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}

// Analytics queries
interface AnalyticsData {
  overview: {
    totalParticipants: number;
    totalStaff: number;
    totalCareerApplications: number;
    totalContactMessages: number;
    totalBudgetAllocated: number;
    averageBudgetPerParticipant: number;
  };
  growth: {
    participants: { current: number; previous: number; growth: number };
    staff: { current: number; previous: number; growth: number };
    applications: { current: number; previous: number; growth: number };
    messages: { current: number; previous: number; growth: number };
  };
  distributions: {
    participantsByStatus: { status: string; count: number }[];
    staffByRole: { role: string; count: number }[];
    applicationsByStatus: { status: string; count: number }[];
    participantsByLocation: { location: string; count: number }[];
    commonDisabilities: { disability: string; count: number }[];
    supportNeedsDistribution: { support_need: string; count: number }[];
  };
  recentActivity: {
    participants: Array<{
      id: string;
      firstName: string;
      lastName: string;
      createdAt: string;
      status: string;
    }>;
    staff: Array<{
      id: string;
      staffRole: string;
      createdAt: string;
      user: { name: string };
    }>;
    applications: Array<{
      id: string;
      firstName: string;
      lastName: string;
      role: string;
      createdAt: string;
      status: string;
    }>;
  };
}

async function fetchAnalytics(): Promise<AnalyticsData> {
  const response = await fetch(`${getBaseUrl()}/api/admin/analytics`);
  if (!response.ok) {
    throw new Error("Failed to fetch analytics");
  }
  return response.json();
}

export function useAnalytics() {
  return useQuery({
    queryKey: adminQueryKeys.analytics(),
    queryFn: fetchAnalytics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
}

// Users queries
async function fetchUsers(params: {
  search?: string;
  role?: string;
  userType?: string;
  status?: string;
}): Promise<UsersResponse> {
  const searchParams = new URLSearchParams();

  if (params.search) searchParams.set("search", params.search);
  if (params.role) searchParams.set("role", params.role);
  if (params.userType) searchParams.set("userType", params.userType);
  if (params.status) searchParams.set("status", params.status);

  const response = await fetch(
    `${getBaseUrl()}/api/admin/users?${searchParams.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}

export function useUsersList(params: {
  search?: string;
  role?: string;
  userType?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: adminQueryKeys.usersList(params),
    queryFn: () => fetchUsers(params),
    staleTime: 2 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}

// SCHEDULING QUERIES

// Types for scheduling data
export interface AppointmentData {
  id: string;
  participant: {
    id: string;
    name: string;
    ndisNumber: string;
    email: string | null;
    phone: string | null;
  };
  staff: {
    id: string;
    name: string;
    email: string;
    role: string;
    employeeId: string | null;
  } | null;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  serviceType: string;
  location: string;
  notes: string | null;
  status: string;
  ndisApproved: boolean;
  createdAt: string;
  updatedAt: string;
  serviceLogs: Array<{
    id: string;
    status: string;
    actualHours: string;
    serviceDate: string;
  }>;
}

export interface AppointmentsResponse {
  appointments: AppointmentData[];
  stats: {
    total: number;
    confirmed: number;
    pending: number;
    cancelled: number;
    completed: number;
    totalHours: number;
  };
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    total: number;
  };
}

export interface StaffShiftData {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  durationHours: number;
  status: string;
  notes: string | null;
}

export interface StaffShiftsData {
  id: string;
  staffName: string;
  role: string;
  employeeId: string | null;
  isActive: boolean;
  shifts: StaffShiftData[];
  totalHours: number;
}

export interface StaffShiftsResponse {
  staffShifts: StaffShiftsData[];
  stats: {
    totalStaff: number;
    totalShifts: number;
    scheduledShifts: number;
    completedShifts: number;
    cancelledShifts: number;
    noShowShifts: number;
    totalHours: number;
  };
  week: {
    start: string;
    end: string;
    type: string;
  };
}

export interface ServiceLogData {
  id: string;
  appointmentId: string;
  participant: {
    id: string;
    name: string;
    ndisNumber: string;
    email: string | null;
    phone: string | null;
  };
  staff: {
    id: string;
    name: string;
    email: string;
    role: string;
    employeeId: string | null;
  };
  serviceDate: string;
  startTime: string | null;
  endTime: string | null;
  actualHours: string;
  serviceType: string;
  description: string;
  location: string;
  status: string;
  notes: string | null;
  ndisApproved: boolean;
  appointment: {
    id: string;
    appointmentDate: string;
    serviceType: string;
    status: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceLogsResponse {
  serviceLogs: ServiceLogData[];
  stats: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    totalHours: number;
    ndisApproved: number;
  };
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    total: number;
  };
}

// Add scheduling query keys
export const schedulingQueryKeys = {
  all: ["admin", "scheduling"] as const,
  appointments: () => [...schedulingQueryKeys.all, "appointments"] as const,
  appointmentsList: (params: {
    search?: string;
    status?: string;
    page?: number;
  }) => [...schedulingQueryKeys.appointments(), "list", params] as const,
  staffShifts: () => [...schedulingQueryKeys.all, "staff-shifts"] as const,
  staffShiftsList: (params: {
    search?: string;
    week?: string;
    status?: string;
  }) => [...schedulingQueryKeys.staffShifts(), "list", params] as const,
  serviceLogs: () => [...schedulingQueryKeys.all, "service-logs"] as const,
  serviceLogsList: (params: {
    search?: string;
    status?: string;
    page?: number;
  }) => [...schedulingQueryKeys.serviceLogs(), "list", params] as const,
  todayAppointments: () =>
    [...schedulingQueryKeys.appointments(), "today"] as const,
};

// API fetch functions
async function fetchAppointments(
  searchParams?: URLSearchParams
): Promise<AppointmentsResponse> {
  const url = searchParams
    ? `/api/admin/scheduling/appointments?${searchParams.toString()}`
    : "/api/admin/scheduling/appointments";

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch appointments");
  }

  return response.json();
}

async function fetchStaffShifts(
  searchParams?: URLSearchParams
): Promise<StaffShiftsResponse> {
  const url = searchParams
    ? `/api/admin/scheduling/shifts?${searchParams.toString()}`
    : "/api/admin/scheduling/shifts";

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch staff shifts");
  }

  return response.json();
}

async function fetchServiceLogs(
  searchParams?: URLSearchParams
): Promise<ServiceLogsResponse> {
  const url = searchParams
    ? `/api/admin/scheduling/service-logs?${searchParams.toString()}`
    : "/api/admin/scheduling/service-logs";

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch service logs");
  }

  return response.json();
}

// React Query hooks for scheduling
export function useAppointments(
  search?: string,
  status?: string,
  page?: number
) {
  const searchParams = new URLSearchParams();

  if (search) searchParams.set("search", search);
  if (status && status !== "all") searchParams.set("status", status);
  if (page && page > 1) searchParams.set("page", page.toString());

  return useQuery({
    queryKey: schedulingQueryKeys.appointmentsList({ search, status, page }),
    queryFn: () => fetchAppointments(searchParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useStaffShifts(
  search?: string,
  week?: string,
  status?: string
) {
  const searchParams = new URLSearchParams();

  if (search) searchParams.set("search", search);
  if (week && week !== "current") searchParams.set("week", week);
  if (status && status !== "all") searchParams.set("status", status);

  return useQuery({
    queryKey: schedulingQueryKeys.staffShiftsList({ search, week, status }),
    queryFn: () => fetchStaffShifts(searchParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useServiceLogs(
  search?: string,
  status?: string,
  page?: number
) {
  const searchParams = new URLSearchParams();

  if (search) searchParams.set("search", search);
  if (status && status !== "all") searchParams.set("status", status);
  if (page && page > 1) searchParams.set("page", page.toString());

  return useQuery({
    queryKey: schedulingQueryKeys.serviceLogsList({ search, status, page }),
    queryFn: () => fetchServiceLogs(searchParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for getting today's appointments (simplified)
export function useTodayAppointments() {
  return useQuery({
    queryKey: schedulingQueryKeys.todayAppointments(),
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      // This would need a custom API endpoint or filtering
      // For now, we'll fetch all and filter client-side
      const response = await fetchAppointments();
      return {
        ...response,
        appointments: response.appointments.filter(
          (appointment) => appointment.appointmentDate === today
        ),
      };
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}
