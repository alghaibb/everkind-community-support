import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import AdminSidebar from "./_components/AdminSidebar";
import AdminHeader from "./_components/AdminHeader";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin panel for EverKind Community Support",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication on the server
  const session = await getServerSession();

  // Check if user is authenticated and has admin role
  if (!session?.user) {
    redirect("/");
  }

  // Type assertion for role check since better-auth doesn't include role by default
  const userWithRole = session.user as typeof session.user & { role?: string };

  if (userWithRole.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <AdminHeader user={session.user} />

      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
