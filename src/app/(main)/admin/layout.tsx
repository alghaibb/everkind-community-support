import { redirect, unauthorized, forbidden } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import { User } from "@/lib/auth";
import AdminSidebar from "./_components/AdminSidebar";
import AdminHeader from "./_components/AdminHeader";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ModalProvider } from "@/providers/modal-provider";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/admin-login");
  }

  const user = session.user as User;

  if (user.userType !== "INTERNAL") {
    unauthorized();
  }

  if (user.role !== "ADMIN") {
    forbidden();
  }

  return (
    <SidebarProvider>
      <AdminSidebar user={user} />
      <SidebarInset>
        <AdminHeader />
        <div className="flex flex-1 flex-col gap-4 p-2 sm:p-4 pt-0 overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
          <ModalProvider />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
