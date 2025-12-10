"use client";

import { useQuery } from "@tanstack/react-query";
import { STALE_TIMES } from "@/lib/performance";

// Staff Dashboard Data
interface StaffDashboardData {
  staffName: string;
  staffRole: string;
  stats: {
    todayShifts: number;
    weekHours: number;
    assignedParticipants: number;
    pendingTimesheets: number;
  };
  todayShifts: Array<{
    id: string;
    startTime: string;
    endTime: string;
    serviceType: string;
    location: string;
    status: string;
    participant?: {
      firstName: string;
      lastName: string;
    };
  }>;
  pendingRequests: Array<{
    id: string;
    shiftDate: string;
    startTime: string;
    endTime: string;
  }>;
  pendingTimesheets: Array<{
    id: string;
    workDate: string;
    totalHours: number;
    status: string;
  }>;
  notifications: Array<{
    id: string;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
  }>;
}

async function fetchStaffDashboard(): Promise<StaffDashboardData> {
  const response = await fetch("/api/staff/dashboard");
  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }
  return response.json();
}

export function useStaffDashboard() {
  return useQuery({
    queryKey: ["staff", "dashboard"],
    queryFn: fetchStaffDashboard,
    staleTime: STALE_TIMES.DYNAMIC, // 1 minute
  });
}

// Staff Schedule
interface StaffScheduleData {
  shifts: Array<{
    id: string;
    shiftDate: string;
    startTime: string;
    endTime: string;
    duration: number;
    status: string;
    serviceType?: string;
    location?: string;
    notes?: string;
    participant?: {
      id: string;
      firstName: string;
      lastName: string;
    };
  }>;
  weeklyHours: number;
  monthlyHours: number;
}

async function fetchStaffSchedule(
  startDate?: string,
  endDate?: string
): Promise<StaffScheduleData> {
  const params = new URLSearchParams();
  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);

  const response = await fetch(`/api/staff/schedule?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch schedule");
  }
  return response.json();
}

export function useStaffSchedule(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ["staff", "schedule", startDate, endDate],
    queryFn: () => fetchStaffSchedule(startDate, endDate),
    staleTime: STALE_TIMES.DYNAMIC, // 1 minute
  });
}

// Available Shifts
interface AvailableShift {
  id: string;
  shiftDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  serviceType: string;
  location: string;
  requiredRole?: string;
  requiredSkills: string[];
  participant?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  hasRequested: boolean;
}

interface AvailableShiftsData {
  shifts: AvailableShift[];
  total: number;
}

async function fetchAvailableShifts(
  page?: number,
  serviceType?: string,
  date?: string
): Promise<AvailableShiftsData> {
  const params = new URLSearchParams();
  if (page) params.set("page", String(page));
  if (serviceType) params.set("serviceType", serviceType);
  if (date) params.set("date", date);

  const response = await fetch(`/api/staff/available-shifts?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch available shifts");
  }
  return response.json();
}

export function useAvailableShifts(
  page?: number,
  serviceType?: string,
  date?: string
) {
  return useQuery({
    queryKey: ["staff", "available-shifts", page, serviceType, date],
    queryFn: () => fetchAvailableShifts(page, serviceType, date),
    staleTime: STALE_TIMES.DYNAMIC, // 1 minute
  });
}

// Staff Participants
interface StaffParticipant {
  id: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  supportNeeds: string[];
  communicationMethod?: string;
  phone?: string;
  email?: string;
  isPrimary: boolean;
}

interface StaffParticipantsData {
  participants: StaffParticipant[];
  total: number;
}

async function fetchStaffParticipants(): Promise<StaffParticipantsData> {
  const response = await fetch("/api/staff/participants");
  if (!response.ok) {
    throw new Error("Failed to fetch participants");
  }
  return response.json();
}

export function useStaffParticipants() {
  return useQuery({
    queryKey: ["staff", "participants"],
    queryFn: fetchStaffParticipants,
    staleTime: STALE_TIMES.SEMI_STATIC, // 15 minutes - rarely changes
  });
}

// Timesheets
interface TimesheetEntry {
  id: string;
  workDate: string;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  totalHours: number;
  serviceType: string;
  location: string;
  description: string;
  status: string;
  submittedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionNotes?: string;
  participant?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface TimesheetsData {
  entries: TimesheetEntry[];
  total: number;
  weeklyHours: number;
  monthlyHours: number;
  pendingCount: number;
  approvedCount: number;
}

async function fetchTimesheets(
  status?: string,
  startDate?: string,
  endDate?: string
): Promise<TimesheetsData> {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);

  const response = await fetch(`/api/staff/timesheets?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch timesheets");
  }
  return response.json();
}

export function useTimesheets(
  status?: string,
  startDate?: string,
  endDate?: string
) {
  return useQuery({
    queryKey: ["staff", "timesheets", status, startDate, endDate],
    queryFn: () => fetchTimesheets(status, startDate, endDate),
    staleTime: STALE_TIMES.DYNAMIC, // 1 minute
  });
}

// Staff Appointments
interface Appointment {
  id: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  serviceType: string;
  location: string;
  status: string;
  notes?: string;
  participant: {
    id: string;
    firstName: string;
    lastName: string;
    phone?: string;
    address: string;
  };
}

interface AppointmentsData {
  appointments: Appointment[];
  total: number;
  todayCount: number;
  weekCount: number;
}

async function fetchAppointments(
  status?: string,
  startDate?: string,
  endDate?: string
): Promise<AppointmentsData> {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);

  const response = await fetch(`/api/staff/appointments?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch appointments");
  }
  return response.json();
}

export function useStaffAppointments(
  status?: string,
  startDate?: string,
  endDate?: string
) {
  return useQuery({
    queryKey: ["staff", "appointments", status, startDate, endDate],
    queryFn: () => fetchAppointments(status, startDate, endDate),
    staleTime: STALE_TIMES.DYNAMIC, // 1 minute
  });
}

// Notifications
interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationsData {
  notifications: Notification[];
  unreadCount: number;
}

async function fetchNotifications(): Promise<NotificationsData> {
  const response = await fetch("/api/staff/notifications");
  if (!response.ok) {
    throw new Error("Failed to fetch notifications");
  }
  return response.json();
}

export function useNotifications() {
  return useQuery({
    queryKey: ["staff", "notifications"],
    queryFn: fetchNotifications,
    staleTime: STALE_TIMES.REALTIME, // 10 seconds - near real-time
  });
}

// Staff Profile
interface StaffProfile {
  id: string;
  user: {
    name: string;
    email: string;
    image?: string;
  };
  staffRole: string;
  employeeId?: string;
  startDate: string;
  phone?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  address?: string;
  certifications: {
    cert3IndividualSupport: boolean;
    ahpraRegistration?: string;
    covidVaccinations: boolean;
    influenzaVaccination: boolean;
    workingWithChildrenCheck: boolean;
    ndisScreeningCheck: boolean;
    policeCheck: boolean;
    firstAidCPR: boolean;
  };
  ndisModules: string[];
  availability?: Record<string, unknown>;
}

async function fetchStaffProfile(): Promise<StaffProfile> {
  const response = await fetch("/api/staff/profile");
  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }
  return response.json();
}

export function useStaffProfile() {
  return useQuery({
    queryKey: ["staff", "profile"],
    queryFn: fetchStaffProfile,
    staleTime: STALE_TIMES.SEMI_STATIC, // 15 minutes - rarely changes
  });
}
