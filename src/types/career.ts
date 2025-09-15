export interface RoleSelectData {
  role?: "Support Worker" | "Enrolled Nurse" | "Registered Nurse";
  [key: string]: unknown;
}

export interface AvailabilityData extends Record<string, { am: boolean; pm: boolean }> {
  monday: { am: boolean; pm: boolean };
  tuesday: { am: boolean; pm: boolean };
  wednesday: { am: boolean; pm: boolean };
  thursday: { am: boolean; pm: boolean };
  friday: { am: boolean; pm: boolean };
  saturday: { am: boolean; pm: boolean };
  sunday: { am: boolean; pm: boolean };
}

export interface CareerFormData {
  // Role
  role?: "Support Worker" | "Enrolled Nurse" | "Registered Nurse";

  // Personal Info
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;

  // Certifications (role-specific)
  cert3IndividualSupport?: string;
  ahpraRegistration?: string;
  covidVaccinations?: string;
  influenzaVaccination?: string;

  // Checks & Clearances
  workingWithChildrenCheck?: string;
  ndisScreeningCheck?: string;
  policeCheck?: string;
  workingRights?: string;

  // Training & Experience
  ndisModules?: string;
  firstAidCPR?: string;
  experience?: string;
  availability?: AvailabilityData;

  // Documents
  resume?: string;
  certificates?: string[];

  // Allow additional properties
  [key: string]: unknown;
}

