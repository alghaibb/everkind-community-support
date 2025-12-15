"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { NotificationDropdown } from "@/components/notification-dropdown";

export default function StaffHeader() {
  const pathname = usePathname();

  // Generate breadcrumb items based on pathname
  const getBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean);
    const breadcrumbs: { label: string; href?: string }[] = [];

    // Always start with Staff
    breadcrumbs.push({ label: "Staff Portal", href: "/staff" });

    // Map path segments to labels
    const labelMap: Record<string, string> = {
      staff: "Dashboard",
      schedule: "My Schedule",
      "available-shifts": "Available Shifts",
      participants: "My Participants",
      timesheets: "Timesheets",
      appointments: "Appointments",
      profile: "My Profile",
      notifications: "Notifications",
    };

    paths.forEach((path, index) => {
      if (path === "staff" && index === 0) return; // Skip first 'staff' as we already added it

      const label =
        labelMap[path] || path.charAt(0).toUpperCase() + path.slice(1);
      const href = "/" + paths.slice(0, index + 1).join("/");

      if (index === paths.length - 1) {
        // Last item, no href (current page)
        breadcrumbs.push({ label });
      } else {
        breadcrumbs.push({ label, href });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="flex h-14 sm:h-16 shrink-0 items-center gap-2 border-b border-border/50 bg-background/95 backdrop-blur-md sticky top-0 z-40">
      <div className="flex flex-1 items-center gap-2 px-3 sm:px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 h-4 hidden sm:block"
        />

        {/* Breadcrumb - hidden on mobile */}
        <Breadcrumb className="hidden sm:flex">
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => (
              <div key={item.label} className="flex items-center">
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {item.href ? (
                    <BreadcrumbLink href={item.href}>
                      {item.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Mobile title */}
        <span className="font-semibold text-sm sm:hidden truncate">
          {breadcrumbs[breadcrumbs.length - 1]?.label || "Staff Portal"}
        </span>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Notifications Dropdown */}
        <NotificationDropdown apiEndpoint="/api/staff/notifications" />
      </div>
    </header>
  );
}
