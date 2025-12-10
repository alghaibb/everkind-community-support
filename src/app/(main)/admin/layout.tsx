import { unauthorized, forbidden } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import AdminSidebar from "./_components/AdminSidebar";
import AdminHeader from "./_components/AdminHeader";
import { AdminKeyboardShortcuts } from "./_components/AdminKeyboardShortcuts";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ModalProvider } from "@/providers/modal-provider";
import { PrefetchAdminRoutes } from "@/components/prefetch-routes";

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

  if (user.userType !== "INTERNAL" || user.role !== "ADMIN") {
    return forbidden();
  }

  return (
    <SidebarProvider>
      <AdminSidebar user={user} />
      <SidebarInset className="overflow-x-hidden min-w-0 bg-background">
        <AdminHeader />
        <AdminKeyboardShortcuts />
        <div className="flex flex-1 flex-col gap-4 xs:gap-5 sm:gap-6 p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 pt-0 overflow-x-hidden min-w-0 max-w-full container-fluid">
          <div className="max-w-[1600px] 3xl:max-w-[1800px] mx-auto w-full min-w-0">
            {/* Page transition wrapper for smooth navigation */}
            <div className="min-h-[calc(100vh-8rem)] min-w-0 max-w-full animate-fade-in">
              {children}
            </div>
          </div>
          <ModalProvider />
          {/* Prefetch common admin routes for instant navigation */}
          <PrefetchAdminRoutes />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
