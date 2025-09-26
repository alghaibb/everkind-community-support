"use server";

import { getServerSession } from "@/lib/get-session";
import { User } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendRejectionEmail, sendWelcomeEmail } from "@/lib/email-service";
import { format } from "date-fns";
import { auth } from "@/lib/auth";
import { generateTempPassword } from "@/lib/utils";
import { env } from "@/lib/env";
import { StaffRole } from "@/generated/prisma";

type AvailabilityData = {
  monday: { am: boolean; pm: boolean };
  tuesday: { am: boolean; pm: boolean };
  wednesday: { am: boolean; pm: boolean };
  thursday: { am: boolean; pm: boolean };
  friday: { am: boolean; pm: boolean };
  saturday: { am: boolean; pm: boolean };
  sunday: { am: boolean; pm: boolean };
};
import { revalidatePath } from "next/cache";

export async function rejectApplication(
  applicationId: string,
  reason?: string
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

    if (!applicationId) {
      throw new Error("Application ID is required");
    }

    const application = await prisma.careerSubmission.findUnique({
      where: { id: applicationId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!application) {
      throw new Error("Application not found");
    }

    await prisma.careerSubmission.update({
      where: { id: applicationId },
      data: {
        status: "REJECTED",
        rejectedAt: new Date(),
        rejectionReason: reason || null,
      },
    });

    try {
      await sendRejectionEmail({
        to: application.email,
        name: `${application.firstName} ${application.lastName}`,
        role: application.role,
        applicationDate: format(
          new Date(application.createdAt),
          "MMMM d, yyyy"
        ),
      });

      console.log("Rejection email sent successfully");
    } catch (emailError) {
      console.error("Failed to send rejection email:", emailError);
    }

    revalidatePath("/admin");
    revalidatePath("/admin/careers");

    return {
      success: true,
      message: "Application rejected successfully",
    };
  } catch (error) {
    console.error("Error rejecting application:", error);
    return { error: "Failed to reject application" };
  }
}

export async function createStaffFromCareer(
  careerId: string,
  staffRole: StaffRole,
  startDate: string
) {
  try {
    const session = await getServerSession();

    if (!session || session.user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    if (!careerId || !staffRole || !startDate) {
      throw new Error("Missing required fields");
    }

    const career = await prisma.careerSubmission.findUnique({
      where: { id: careerId },
    });

    if (!career) {
      throw new Error("Career submission not found");
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: career.email },
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const tempPassword = generateTempPassword();

    const userResult = await auth.api.signUpEmail({
      body: {
        email: career.email,
        password: tempPassword,
        name: `${career.firstName} ${career.lastName}`,
      },
    });

    if (!userResult) {
      throw new Error("Failed to create user account");
    }

    await prisma.user.update({
      where: { email: career.email },
      data: {
        userType: "INTERNAL",
        role: "STAFF",
        emailVerified: true,
      },
    });

    const user = await prisma.user.findUnique({
      where: { email: career.email },
    });

    if (!user) {
      throw new Error("Failed to retrieve created user");
    }

    await prisma.staff.create({
      data: {
        userId: user.id,
        staffRole: staffRole,
        startDate: new Date(startDate),
        phone: career.phone,
        cert3IndividualSupport: career.cert3IndividualSupport === "Yes",
        ahpraRegistration: career.ahpraRegistration || null,
        covidVaccinations: career.covidVaccinations === "Yes",
        influenzaVaccination: career.influenzaVaccination === "Yes",
        workingWithChildrenCheck: career.workingWithChildrenCheck === "Yes",
        ndisScreeningCheck: career.ndisScreeningCheck === "Yes",
        policeCheck: career.policeCheck === "Yes",
        firstAidCPR: career.firstAidCPR === "Yes",
        workingRights: career.workingRights === "Yes",
        ndisModules: career.ndisModules.split(",").map((m) => m.trim()),
        availability: career.availability as AvailabilityData,
        resume: career.resume,
      },
    });

    try {
      await sendWelcomeEmail({
        to: career.email,
        name: `${career.firstName} ${career.lastName}`,
        email: career.email,
        tempPassword,
        loginUrl: `${env.NEXT_PUBLIC_BASE_URL}/staff-login`,
      });
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
    }

    await prisma.careerSubmission.update({
      where: { id: careerId },
      data: {
        status: "ACCEPTED",
        reviewedBy: session.user.id,
        reviewedAt: new Date(),
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/careers");

    return {
      success: true,
      message: "Staff account created successfully",
    };
  } catch (error) {
    console.error("Error creating staff from career:", error);
    return { error: "Failed to create staff from career" };
  }
}

export async function deleteCareerSubmission(careerId: string) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    if (session.user.userType !== "INTERNAL" || session.user.role !== "ADMIN") {
      throw new Error("Forbidden");
    }

    await prisma.careerSubmission.delete({
      where: { id: careerId },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/careers");

    return { success: true, message: "Career submission deleted successfully" };
  } catch (error) {
    console.error("Error deleting career submission:", error);
    return { error: "Failed to delete career submission" };
  }
}
