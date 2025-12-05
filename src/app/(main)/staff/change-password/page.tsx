import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { ChangePasswordForm } from "./_components/ChangePasswordForm";

export const metadata: Metadata = {
  title: "Change Password | EverKind Staff",
  description: "Change your temporary password",
};

export default async function ChangePasswordPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/staff-login");
  }

  // Check if user actually needs to change password
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { mustChangePassword: true },
  });

  // If they don't need to change password, redirect to dashboard
  if (!user?.mustChangePassword) {
    redirect("/staff");
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <ChangePasswordForm userEmail={session.user.email} />
    </div>
  );
}
