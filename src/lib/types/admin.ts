import { ApplicationStatus } from "@/generated/prisma";

export interface DashboardStats {
  applications: {
    total: number;
    weekly: number;
    monthly: number;
  };
  messages: {
    total: number;
    weekly: number;
    monthly: number;
  };
  staff: {
    total: number;
  };
  recent: {
    applications: RecentApplication[];
    messages: RecentMessage[];
  };
}

export interface RecentApplication {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
}

export interface RecentMessage {
  id: string;
  firstName: string;
  lastName: string;
  subject: string;
  createdAt: string;
}

export interface CareerApplication {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  experience: string;
  createdAt: Date;
  cert3IndividualSupport: string;
  ahpraRegistration: string | null;
  workingWithChildrenCheck: string;
  ndisScreeningCheck: string;
  policeCheck: string;
  firstAidCPR: string;
  resume: string | null;
  wwccDocument: string | null;
  ndisDocument: string | null;
  policeCheckDocument: string | null;
  firstAidCertificate: string | null;
  qualificationCertificate: string | null;
  ahpraCertificate: string | null;
  status?: ApplicationStatus;
  rejectedAt?: Date | null;
}

// Raw API response with string dates
export interface CareerApplicationRaw {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  experience: string;
  createdAt: string;
  cert3IndividualSupport: string | null;
  ahpraRegistration: string | null;
  workingWithChildrenCheck: string | null;
  ndisScreeningCheck: string | null;
  policeCheck: string | null;
  firstAidCPR: string | null;
  resume: string | null;
  wwccDocument: string | null;
  ndisDocument: string | null;
  policeCheckDocument: string | null;
  firstAidCertificate: string | null;
  qualificationCertificate: string | null;
  ahpraCertificate: string | null;
  status: string | null;
  rejectedAt: string | null;
}

export interface CareerApplicationsApiResponse {
  applications: CareerApplicationRaw[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  stats: {
    total: number;
    thisWeek: number;
    thisMonth: number;
    byRole: Array<{
      role: string;
      _count: { role: number };
    }>;
  };
}

export interface CareerApplicationsResponse {
  applications: CareerApplication[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  stats: {
    total: number;
    thisWeek: number;
    thisMonth: number;
    byRole: Array<{
      role: string;
      _count: { role: number };
    }>;
  };
}

// Contact message interfaces
export interface ContactMessage {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: Date;
}

export interface ContactMessageRaw {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface ContactMessagesApiResponse {
  messages: ContactMessageRaw[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface ContactMessagesResponse {
  messages: ContactMessage[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}
