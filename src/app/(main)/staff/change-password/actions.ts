"use server";

import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

interface ChangePasswordResult {
  success: boolean;
  error?: string;
}

export async function changeTemporaryPassword(
  input: ChangePasswordInput
): Promise<ChangePasswordResult> {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    // Verify user needs to change password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { mustChangePassword: true, email: true },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    if (!user.mustChangePassword) {
      return { success: false, error: "Password change not required" };
    }

    // Use better-auth's change password functionality
    const headersList = await headers();
    const response = await auth.api.changePassword({
      body: {
        currentPassword: input.currentPassword,
        newPassword: input.newPassword,
      },
      headers: headersList,
    });

    if (!response) {
      return { success: false, error: "Failed to change password" };
    }

    // Update the mustChangePassword flag
    await prisma.user.update({
      where: { id: session.user.id },
      data: { mustChangePassword: false },
    });

    return { success: true };
  } catch (error) {
    console.error("Change password error:", error);

    // Handle specific error messages from better-auth
    if (error instanceof Error) {
      if (error.message.includes("Invalid password") || error.message.includes("incorrect")) {
        return { success: false, error: "Current password is incorrect" };
      }
      return { success: false, error: error.message };
    }

    return { success: false, error: "An unexpected error occurred" };
  }
}
