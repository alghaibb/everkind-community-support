"use server";

import { getServerSession } from "@/lib/get-session";
import { User } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createStaff(data: {
  userId: string;
  staffRole: string;
  employeeId?: string;
  startDate: string;
  phone?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  address?: string;
}) {
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
        staffRole: data.staffRole as any,
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

    return { success: true, staff };
  } catch (error) {
    console.error("Error creating staff:", error);
    return { error: "Failed to create staff member" };
  }
}

export async function updateStaff(
  staffId: string,
  data: Partial<{
    staffRole: string;
    employeeId: string;
    startDate: string;
    endDate: string;
    phone: string;
    emergencyContact: string;
    emergencyPhone: string;
    address: string;
    cert3IndividualSupport: boolean;
    ahpraRegistration: string;
    covidVaccinations: boolean;
    influenzaVaccination: boolean;
    workingWithChildrenCheck: boolean;
    ndisScreeningCheck: boolean;
    policeCheck: boolean;
    firstAidCPR: boolean;
    workingRights: boolean;
    ndisModules: string[];
    availability: any;
    hourlyRate: number;
    resume: string;
    certificates: string[];
  }>
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const user = session.user as User;
    if (user.userType !== "INTERNAL" || user.role !== "ADMIN") {
      throw new Error("Forbidden");
    }

    const updateData: any = { ...data };
    if (data.startDate) updateData.startDate = new Date(data.startDate);
    if (data.endDate)
      updateData.endDate = data.endDate ? new Date(data.endDate) : null;

    const staff = await prisma.staff.update({
      where: { id: staffId },
      data: updateData,
    });

    revalidatePath("/admin");
    revalidatePath("/admin/staff");

    return { success: true, staff };
  } catch (error) {
    console.error("Error updating staff:", error);
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
