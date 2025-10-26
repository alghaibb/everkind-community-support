import { unauthorized, forbidden } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import AdminSidebar from "./_components/AdminSidebar";
import AdminHeader from "./_components/AdminHeader";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ModalProvider } from "@/providers/modal-provider";

// Performance monitoring for navigation
if (typeof window !== "undefined") {
  // Monitor route changes for performance
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === "navigation") {
        console.log("Navigation performance:", {
          duration: entry.duration,
          type: (entry as any).type,
          name: entry.name,
        });
      }
    }
  });

  observer.observe({ entryTypes: ["navigation"] });

  // Preload admin routes on mount for instant navigation
  const adminRoutes = [
    "/admin/staff",
    "/admin/careers",
    "/admin/participants",
    "/admin/messages",
    "/admin/users",
    "/admin/analytics",
  ];

  // Prefetch routes after a short delay to not block initial load
  setTimeout(() => {
    adminRoutes.forEach((route) => {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = route;
      link.as = "document";
      document.head.appendChild(link);
    });
  }, 1000);
}

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
      <SidebarInset>
        <AdminHeader />
        <div className="flex flex-1 flex-col gap-4 p-2 sm:p-4 pt-0 overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full">
            {/* Page transition wrapper for smooth navigation */}
            <div className="min-h-[calc(100vh-8rem)]">{children}</div>
          </div>
          <ModalProvider />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
