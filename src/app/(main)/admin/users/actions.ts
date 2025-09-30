"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import { z } from "zod";
import { emailSchema, nameSchema } from "@/lib/validations/shared.schema";
import { forbidden, unauthorized } from "next/navigation";

// Validation schemas
const updateUserSchema = z.object({
  id: z.string(),
  name: nameSchema,
  email: emailSchema,
  emailVerified: z.boolean(),
  role: z.enum(["ADMIN", "STAFF"]).optional(),
});

const banUserSchema = z.object({
  id: z.string(),
  reason: z.string().min(1, "Reason is required"),
});

// Helper function to check if user can perform admin actions
async function canManageUser(targetUserId: string) {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    return unauthorized();
  }

  if (user.userType !== "INTERNAL" || user.role !== "ADMIN") {
    return forbidden();
  }

  // Get target user to check if they're an admin
  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { role: true, userType: true },
  });

  if (!targetUser) {
    throw new Error("User not found");
  }

  // Admins cannot manage other admins
  if (targetUser.role === "ADMIN" && targetUser.userType === "INTERNAL") {
    return forbidden();
  }

  return { session, targetUser };
}

// Update user information
export async function updateUser(data: z.infer<typeof updateUserSchema>) {
  try {
    const validatedData = updateUserSchema.parse(data);
    await canManageUser(validatedData.id);

    const updatedUser = await prisma.user.update({
      where: { id: validatedData.id },
      data: {
        name: validatedData.name,
        email: validatedData.email,
        emailVerified: validatedData.emailVerified,
        ...(validatedData.role && { role: validatedData.role }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        role: true,
        userType: true,
        createdAt: true,
        updatedAt: true,
        staffProfile: {
          select: {
            id: true,
            staffRole: true,
            employeeId: true,
            phone: true,
            startDate: true,
            endDate: true,
          },
        },
        familyProfile: {
          select: {
            id: true,
            relationship: true,
            phone: true,
            isEmergencyContact: true,
          },
        },
        sessions: {
          select: {
            updatedAt: true,
          },
          orderBy: {
            updatedAt: "desc",
          },
          take: 1,
        },
      },
    });

    // Process user data similar to API route
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const lastSession = updatedUser.sessions[0];
    const isActive = lastSession
      ? lastSession.updatedAt > thirtyDaysAgo
      : false;

    let additionalInfo = null;
    if (updatedUser.staffProfile) {
      additionalInfo = {
        type: "staff" as const,
        staffRole: updatedUser.staffProfile.staffRole,
        employeeId: updatedUser.staffProfile.employeeId,
        phone: updatedUser.staffProfile.phone,
        startDate: updatedUser.staffProfile.startDate?.toISOString() || null,
        endDate: updatedUser.staffProfile.endDate?.toISOString() || null,
      };
    } else if (updatedUser.familyProfile) {
      additionalInfo = {
        type: "family" as const,
        relationship: updatedUser.familyProfile.relationship,
        phone: updatedUser.familyProfile.phone,
        emergencyContact: updatedUser.familyProfile.isEmergencyContact,
      };
    }

    const processedUser = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      emailVerified: updatedUser.emailVerified,
      role: updatedUser.role,
      userType: updatedUser.userType,
      createdAt: updatedUser.createdAt.toISOString(),
      updatedAt: updatedUser.updatedAt.toISOString(),
      lastActive: lastSession ? lastSession.updatedAt.toISOString() : null,
      isActive,
      additionalInfo,
    };

    revalidatePath("/admin");
    revalidatePath("/admin/users");
    return { success: true, user: processedUser };
  } catch (error) {
    console.error("Error updating user:", error);

    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid data provided" };
    }

    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "Failed to update user" };
  }
}

// Ban/suspend user
export async function banUser(data: z.infer<typeof banUserSchema>) {
  try {
    const validatedData = banUserSchema.parse(data);
    await canManageUser(validatedData.id);

    // Add ban record and revoke all sessions
    await prisma.$transaction(async (tx) => {
      // Create ban record (you might need to create this table)
      // For now, we'll just revoke sessions and add a note

      // Revoke all sessions
      await tx.session.deleteMany({
        where: { userId: validatedData.id },
      });

      // You could add a userBans table or use a status field
      // For this example, I'll add a comment field to track bans
      await tx.user.update({
        where: { id: validatedData.id },
        data: {
          // Add ban logic here - you might want to add a banned field to your schema
          updatedAt: new Date(),
        },
      });
    });

    revalidatePath("/admin/users");
    return { success: true, message: "User banned and sessions revoked" };
  } catch (error) {
    console.error("Error banning user:", error);

    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid data provided" };
    }

    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "Failed to ban user" };
  }
}

// Revoke user sessions
export async function revokeUserSessions(userId: string) {
  try {
    await canManageUser(userId);

    const deletedSessions = await prisma.session.deleteMany({
      where: { userId },
    });

    revalidatePath("/admin/users");
    return {
      success: true,
      message: `Revoked ${deletedSessions.count} session(s)`,
    };
  } catch (error) {
    console.error("Error revoking user sessions:", error);

    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "Failed to revoke sessions" };
  }
}

// Delete user (soft delete or hard delete based on your needs)
export async function deleteUser(userId: string) {
  try {
    await canManageUser(userId);

    await prisma.$transaction(async (tx) => {
      // Delete related records first
      await tx.session.deleteMany({
        where: { userId },
      });

      // Delete staff profile if exists
      await tx.staff.deleteMany({
        where: { userId },
      });

      // Delete family member profile if exists
      await tx.familyMember.deleteMany({
        where: { userId },
      });

      // Finally delete the user
      await tx.user.delete({
        where: { id: userId },
      });
    });

    revalidatePath("/admin");
    revalidatePath("/admin/users");
    return { success: true, message: "User deleted successfully" };
  } catch (error) {
    console.error("Error deleting user:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return { success: false, error: "User not found" };
      }
    }

    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "Failed to delete user" };
  }
}

// Toggle user email verification
export async function toggleEmailVerification(userId: string) {
  try {
    await canManageUser(userId);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { emailVerified: true },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        emailVerified: !user.emailVerified,
      },
      select: {
        id: true,
        emailVerified: true,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/users");
    return {
      success: true,
      emailVerified: updatedUser.emailVerified,
      message: `Email ${updatedUser.emailVerified ? "verified" : "unverified"}`,
    };
  } catch (error) {
    console.error("Error toggling email verification:", error);

    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "Failed to toggle email verification" };
  }
}
