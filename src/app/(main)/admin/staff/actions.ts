"use server";

import { getServerSession } from "@/lib/get-session";
import { User } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { StaffRole, Prisma } from "@/generated/prisma/client";

export interface CreateStaffData {
  userId: string;
  staffRole: string;
  employeeId?: string;
  startDate: string;
  phone?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  address?: string;
}

export interface UpdateStaffData {
  staffRole?: string;
  employeeId?: string;
  startDate?: string;
  endDate?: string;
  phone?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  address?: string;
  cert3IndividualSupport?: boolean;
  ahpraRegistration?: string;
  covidVaccinations?: boolean;
  influenzaVaccination?: boolean;
  workingWithChildrenCheck?: boolean;
  ndisScreeningCheck?: boolean;
  policeCheck?: boolean;
  firstAidCPR?: boolean;
  workingRights?: boolean;
  ndisModules?: string[];
  availability?: Prisma.InputJsonValue;
  hourlyRate?: number;
  resume?: string;
  certificates?: string[];
}

export async function createStaff(data: CreateStaffData) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const user = session.user as User;
    if (user.userType !== "INTERNAL" || user.role !== "ADMIN") {
      throw new Error("Forbidden");
    }

    const staff = await prisma.staff.create({
      data: {
        userId: data.userId,
        staffRole: data.staffRole as StaffRole,
        employeeId: data.employeeId,
        startDate: new Date(data.startDate),
        phone: data.phone,
        emergencyContact: data.emergencyContact,
        emergencyPhone: data.emergencyPhone,
        address: data.address,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/staff");

    // Serialize the staff data to handle Decimal objects
    const serializedStaff = {
      ...staff,
      hourlyRate: staff.hourlyRate ? Number(staff.hourlyRate) : null,
    };

    return { success: true, staff: serializedStaff as typeof serializedStaff };
  } catch (error: unknown) {
    console.error("Error creating staff:", error);

    // Handle unique constraint violations
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const field = error.meta?.target as string[] | undefined;
      const fieldName = field?.[0];
      switch (fieldName) {
        case "phone":
          return {
            error:
              "This phone number is already in use by another staff member",
          };
        case "employeeId":
          return {
            error: "This employee ID is already in use by another staff member",
          };
        case "ahpraRegistration":
          return {
            error:
              "This AHPRA registration number is already in use by another staff member",
          };
        default:
          return {
            error: "This value is already in use by another staff member",
          };
      }
    }

    return { error: "Failed to create staff member" };
  }
}

export async function updateStaff(staffId: string, data: UpdateStaffData) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const user = session.user as User;
    if (user.userType !== "INTERNAL" || user.role !== "ADMIN") {
      throw new Error("Forbidden");
    }

    const updateData: {
      staffRole?: StaffRole;
      employeeId?: string;
      startDate?: Date;
      endDate?: Date | null;
      phone?: string;
      emergencyContact?: string;
      emergencyPhone?: string;
      address?: string;
      cert3IndividualSupport?: boolean;
      ahpraRegistration?: string;
      covidVaccinations?: boolean;
      influenzaVaccination?: boolean;
      workingWithChildrenCheck?: boolean;
      ndisScreeningCheck?: boolean;
      policeCheck?: boolean;
      firstAidCPR?: boolean;
      workingRights?: boolean;
      ndisModules?: string[];
      availability?: Prisma.InputJsonValue;
      hourlyRate?: number;
      resume?: string;
      certificates?: string[];
    } = {};

    // Copy non-date fields
    if (data.employeeId !== undefined) updateData.employeeId = data.employeeId;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.emergencyContact !== undefined)
      updateData.emergencyContact = data.emergencyContact;
    if (data.emergencyPhone !== undefined)
      updateData.emergencyPhone = data.emergencyPhone;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.cert3IndividualSupport !== undefined)
      updateData.cert3IndividualSupport = data.cert3IndividualSupport;
    if (data.ahpraRegistration !== undefined)
      updateData.ahpraRegistration = data.ahpraRegistration;
    if (data.covidVaccinations !== undefined)
      updateData.covidVaccinations = data.covidVaccinations;
    if (data.influenzaVaccination !== undefined)
      updateData.influenzaVaccination = data.influenzaVaccination;
    if (data.workingWithChildrenCheck !== undefined)
      updateData.workingWithChildrenCheck = data.workingWithChildrenCheck;
    if (data.ndisScreeningCheck !== undefined)
      updateData.ndisScreeningCheck = data.ndisScreeningCheck;
    if (data.policeCheck !== undefined)
      updateData.policeCheck = data.policeCheck;
    if (data.firstAidCPR !== undefined)
      updateData.firstAidCPR = data.firstAidCPR;
    if (data.workingRights !== undefined)
      updateData.workingRights = data.workingRights;
    if (data.ndisModules !== undefined)
      updateData.ndisModules = data.ndisModules;
    if (data.availability !== undefined)
      updateData.availability = data.availability;
    if (data.hourlyRate !== undefined) updateData.hourlyRate = data.hourlyRate;
    if (data.resume !== undefined) updateData.resume = data.resume;
    if (data.certificates !== undefined)
      updateData.certificates = data.certificates;

    // Handle special field transformations
    if (data.startDate) updateData.startDate = new Date(data.startDate);
    if (data.endDate !== undefined)
      updateData.endDate = data.endDate ? new Date(data.endDate) : null;
    if (data.staffRole) updateData.staffRole = data.staffRole as StaffRole;

    const staff = await prisma.staff.update({
      where: { id: staffId },
      data: updateData,
    });

    revalidatePath("/admin");
    revalidatePath("/admin/staff");

    // Serialize the staff data to handle Decimal objects
    const serializedStaff = {
      ...staff,
      hourlyRate: staff.hourlyRate ? Number(staff.hourlyRate) : null,
    };

    return { success: true, staff: serializedStaff as typeof serializedStaff };
  } catch (error: unknown) {
    console.error("Error updating staff:", error);

    // Handle unique constraint violations
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const field = error.meta?.target as string[] | undefined;
      const fieldName = field?.[0];
      switch (fieldName) {
        case "phone":
          return {
            error:
              "This phone number is already in use by another staff member",
          };
        case "employeeId":
          return {
            error: "This employee ID is already in use by another staff member",
          };
        case "ahpraRegistration":
          return {
            error:
              "This AHPRA registration number is already in use by another staff member",
          };
        default:
          return {
            error: "This value is already in use by another staff member",
          };
      }
    }

    return { error: "Failed to update staff member" };
  }
}

export async function deleteStaff(staffId: string) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const user = session.user as User;
    if (user.userType !== "INTERNAL" || user.role !== "ADMIN") {
      throw new Error("Forbidden");
    }

    await prisma.staff.delete({
      where: { id: staffId },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/staff");

    return { success: true, message: "Staff member deleted successfully" };
  } catch (error) {
    console.error("Error deleting staff:", error);
    return { error: "Failed to delete staff member" };
  }
}

export async function toggleStaffStatus(staffId: string) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const user = session.user as User;
    if (user.userType !== "INTERNAL" || user.role !== "ADMIN") {
      throw new Error("Forbidden");
    }

    const staff = await prisma.staff.findUnique({
      where: { id: staffId },
      select: { isActive: true },
    });

    if (!staff) {
      throw new Error("Staff member not found");
    }

    await prisma.staff.update({
      where: { id: staffId },
      data: { isActive: !staff.isActive },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/staff");

    return {
      success: true,
      message: `Staff member ${!staff.isActive ? "activated" : "deactivated"} successfully`,
      isActive: !staff.isActive,
    };
  } catch (error) {
    console.error("Error toggling staff status:", error);
    return { error: "Failed to update staff status" };
  }
}
