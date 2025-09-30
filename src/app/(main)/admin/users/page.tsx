import { Metadata } from "next";
import { getServerSession } from "@/lib/get-session";
import { forbidden, unauthorized } from "next/navigation";
import { Suspense } from "react";
import { UsersPageContent } from "./_components/UsersPageContent";
import { UsersSkeleton } from "./_components/UsersSkeleton";

export const metadata: Metadata = {
  title: "Users Management",
  description: "Manage all users including admins, staff, and family members",
};

export default async function UsersPage() {
  const session = await getServerSession();

  if (!session?.user) {
    return unauthorized();
  }

  if (session.user.userType !== "INTERNAL" || session.user.role !== "ADMIN") {
    return forbidden();
  }

  return (
    <Suspense fallback={<UsersSkeleton />}>
      <UsersPageContent />
    </Suspense>
  );
}
