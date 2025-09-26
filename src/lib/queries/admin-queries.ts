import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  DashboardStats,
  CareerApplicationsResponse,
  CareerApplicationsApiResponse,
  ContactMessagesResponse,
  ContactMessagesApiResponse,
  StaffResponse,
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
