"use client";

import { usePathname } from "next/navigation";
import { memo, useMemo } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Home, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const routeLabels: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/staff": "Staff Management",
  "/admin/careers": "Career Applications",
  "/admin/participants": "Participants",
  "/admin/messages": "Messages",
  "/admin/analytics": "Analytics",
  "/admin/users": "Users",
  "/admin/profile": "Profile Settings",
};

const AdminHeaderComponent = () => {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const crumbs = [];

    // Always start with Admin
    crumbs.push({
      label: "Admin",
      href: "/admin",
      isActive: pathname === "/admin",
    });

    // Add subsequent segments
    let currentPath = "";
    for (let i = 1; i < segments.length; i++) {
      currentPath += `/${segments[i]}`;
      const fullPath = `/admin${currentPath}`;
      const isLast = i === segments.length - 1;

      crumbs.push({
        label:
          routeLabels[fullPath] ||
          segments[i].charAt(0).toUpperCase() + segments[i].slice(1),
        href: fullPath,
        isActive: isLast,
      });
    }

    return crumbs;
  }, [pathname]);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="w-full flex items-center gap-2 px-2 sm:px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb className="flex-1 min-w-0">
          <BreadcrumbList className="flex-wrap">
            {breadcrumbs.map((breadcrumb, index) => (
              <div
                key={breadcrumb.href}
                className="flex items-center gap-1 sm:gap-2"
              >
                {index > 0 && (
                  <BreadcrumbSeparator className="hidden sm:block" />
                )}
                <BreadcrumbItem className="min-w-0">
                  {breadcrumb.isActive ? (
                    <BreadcrumbPage className="flex items-center gap-1 text-xs sm:text-sm truncate">
                      {index === 0 && (
                        <Shield className="h-3 w-3 flex-shrink-0" />
                      )}
                      <span className="truncate">{breadcrumb.label}</span>
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      asChild
                    >
                      <Link
                        href={breadcrumb.href}
                        prefetch={true}
                        className="flex items-center gap-1 text-xs sm:text-sm truncate"
                      >
                        {index === 0 && (
                          <Shield className="h-3 w-3 flex-shrink-0" />
                        )}
                        <span className="truncate">{breadcrumb.label}</span>
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="ml-auto flex-shrink-0">
          <Button asChild variant="ghost" size="icon">
            <Link href="/">
              <Home className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default memo(AdminHeaderComponent);
