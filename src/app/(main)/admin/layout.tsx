import { Metadata } from "next";
import { forbidden, unauthorized } from "next/navigation";
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
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    return unauthorized();
  }

  const userWithRole = user as typeof user & { role?: string };

  if (userWithRole.role !== "ADMIN") {
    return forbidden();
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader user={user} />

      <div className="flex">
        <AdminSidebar />

        <main className="flex-1 p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
