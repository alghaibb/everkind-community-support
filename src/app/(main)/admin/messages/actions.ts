"use server";

import { sendReplyEmail as sendReplyEmailService } from "@/lib/email-service";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/get-session";
import { revalidatePath } from "next/cache";

interface SendReplyEmailParams {
  to: string;
  toName: string;
  subject: string;
  message: string;
  originalMessage: {
    subject: string;
    message: string;
    createdAt: Date;
  };
}

export async function sendReplyEmail({
  to,
  toName,
  subject,
  message,
  originalMessage,
}: SendReplyEmailParams) {
  try {
    const result = await sendReplyEmailService({
      to,
      toName,
      subject,
      message,
      originalMessage,
    });

    if (result.error) {
      console.error("Failed to send reply email:", result.error);
      throw new Error("Failed to send reply email");
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Error sending reply email:", error);
    throw error;
  }
}

export async function deleteContactMessage(messageId: string) {
  try {
    const session = await getServerSession();
    const user = session?.user;

    if (!user) {
      throw new Error("Unauthorized");
    }

    if (user.userType !== "INTERNAL" || user.role !== "ADMIN") {
      throw new Error("Forbidden");
    }

    await prisma.contactMessage.delete({
      where: { id: messageId },
    });

    revalidatePath("/admin/messages");

    return { success: "Contact message deleted successfully" };
  } catch (error) {
    console.error("Error deleting contact message:", error);
    return { error: "Failed to delete contact message" };
  }
}
