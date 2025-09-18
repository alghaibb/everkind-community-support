"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/get-session";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import type {
  CreateStaffFormData,
  EditStaffFormData,
} from "@/lib/validations/staff.schema";

/**
 * Create a new staff account
 */
export async function createStaffAccount(data: CreateStaffFormData) {
  try {
    // Check if user is admin
    const session = await getServerSession();

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const userWithRole = session?.user as typeof session.user & { role?: string };

    if (!session?.user || userWithRole.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return { success: false, error: "A user with this email already exists" };
    }

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        id: nanoid(),
        name: data.name,
        email: data.email,
        role: data.role,
        emailVerified: data.emailVerified,
      },
    });

    // TODO: If sendWelcomeEmail is true, send email with login credentials
    // This would typically integrate with your email service
    if (data.sendWelcomeEmail) {
      console.log("📧 Would send welcome email to:", data.email);
      // await sendWelcomeEmail(newUser);
    }

    revalidatePath("/admin/staff");
    return { success: true, userId: newUser.id };
  } catch (error) {
    console.error("Error creating staff account:", error);
    return { success: false, error: "Failed to create account" };
  }
}

/**
 * Update an existing staff account
 */
export async function updateStaffAccount(userId: string, data: EditStaffFormData) {
  try {
    // Check if user is admin
    const session = await getServerSession();

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const userWithRole = session?.user as typeof session.user & { role?: string };

    if (!session?.user || userWithRole.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    // Check if email is being changed and if it already exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return { success: false, error: "User not found" };
    }

    if (data.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (emailExists) {
        return { success: false, error: "A user with this email already exists" };
      }
    }

    // Prevent admin from removing their own admin role
    if (userId === session.user.id && data.role !== "ADMIN") {
      return { success: false, error: "You cannot remove your own admin privileges" };
    }

    // Update the user
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
        emailVerified: data.emailVerified,
      },
    });

    revalidatePath("/admin/staff");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Error updating staff account:", error);
    return { success: false, error: "Failed to update account" };
  }
}

/**
 * Delete a staff account
 */
export async function deleteStaffAccount(userId: string) {
  try {
    // Check if user is admin
    const session = await getServerSession();

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const userWithRole = session?.user as typeof session.user & { role?: string };

    if (!session?.user || userWithRole.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    // Prevent admin from deleting their own account
    if (userId === session.user.id) {
      return { success: false, error: "You cannot delete your own account" };
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Delete the user (cascading delete will handle related records)
    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath("/admin/staff");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Error deleting staff account:", error);
    return { success: false, error: "Failed to delete account" };
  }
}
