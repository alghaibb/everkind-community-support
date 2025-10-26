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

