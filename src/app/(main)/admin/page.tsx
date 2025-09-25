import { Suspense } from "react";
import { getServerSession } from "@/lib/get-session";
import { User } from "@/lib/auth";
import { AdminDashboardSkeleton } from "./_components/AdminDashboardSkeleton";
import { DashboardContent } from "./_components/DashboardContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description:
    "Admin dashboard for managing the EverKind community support program.",
};

export default async function AdminDashboard() {
  const session = await getServerSession();
  const user = session?.user as User;

  return (
    <Suspense fallback={<AdminDashboardSkeleton />}>
      <DashboardContent userName={user.name} />
    </Suspense>
  );
}
