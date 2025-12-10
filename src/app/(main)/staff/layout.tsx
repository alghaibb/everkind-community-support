import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ModalProvider } from "@/providers/modal-provider";
import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import StaffSidebar from "./_components/StaffSidebar";
import StaffHeader from "./_components/StaffHeader";
import { PrefetchStaffRoutes } from "@/components/prefetch-routes";

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/staff-login");
  }

  // Check if user is a staff member
  if (session.user.userType !== "INTERNAL") {
    redirect("/");
  }

  // Get staff profile and user data
  const [staffProfile, user] = await Promise.all([
    prisma.staff.findUnique({
      where: { userId: session.user.id },
      select: { staffRole: true, isActive: true },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { mustChangePassword: true },
    }),
  ]);

  if (!staffProfile || !staffProfile.isActive) {
    redirect("/");
  }

  // Get current pathname from headers (set by middleware)
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isOnChangePasswordPage = pathname.includes("/staff/change-password");

  // Redirect to change password if needed (backup to middleware)
  if (user?.mustChangePassword && !isOnChangePasswordPage) {
    redirect("/staff/change-password");
  }

  // Show simplified layout for password change page
  if (isOnChangePasswordPage) {
    return (
      <div className="min-h-screen bg-mesh-gradient">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <StaffSidebar user={session.user} staffRole={staffProfile.staffRole} />
      <SidebarInset className="overflow-x-hidden min-w-0 bg-background">
        <StaffHeader />
        <div className="flex flex-1 flex-col gap-4 xs:gap-5 sm:gap-6 p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 pt-0 overflow-x-hidden min-w-0 max-w-full container-fluid">
          <div className="max-w-[1600px] 3xl:max-w-[1800px] mx-auto w-full min-w-0">
            <div className="min-h-[calc(100vh-8rem)] min-w-0 max-w-full animate-fade-in">
              {children}
            </div>
          </div>
          <ModalProvider />
          {/* Prefetch common staff routes for instant navigation */}
          <PrefetchStaffRoutes />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
