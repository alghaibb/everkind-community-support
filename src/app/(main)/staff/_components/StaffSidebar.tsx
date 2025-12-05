"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useMemo } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Settings, ChevronUp, Heart } from "lucide-react";
import { User } from "@/lib/auth";
import LogoutButton from "@/components/logout-button";
import { Separator } from "@/components/ui/separator";
import { STAFF_NAVIGATION_ITEMS } from "../constants";
import dynamic from "next/dynamic";

const DropdownMenu = dynamic(
  () => import("@/components/ui/dropdown-menu").then((mod) => mod.DropdownMenu),
  { ssr: false }
);
const DropdownMenuContent = dynamic(
  () =>
    import("@/components/ui/dropdown-menu").then(
      (mod) => mod.DropdownMenuContent
    ),
  { ssr: false }
);
const DropdownMenuItem = dynamic(
  () =>
    import("@/components/ui/dropdown-menu").then((mod) => mod.DropdownMenuItem),
  { ssr: false }
);
const DropdownMenuSeparator = dynamic(
  () =>
    import("@/components/ui/dropdown-menu").then(
      (mod) => mod.DropdownMenuSeparator
    ),
  { ssr: false }
);
const DropdownMenuTrigger = dynamic(
  () =>
    import("@/components/ui/dropdown-menu").then(
      (mod) => mod.DropdownMenuTrigger
    ),
  { ssr: false }
);

interface StaffSidebarProps {
  user: User;
  staffRole?: string;
}

const StaffSidebarComponent = ({ user, staffRole }: StaffSidebarProps) => {
  const pathname = usePathname();

  const getInitials = useMemo(
    () => (name: string) => {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    },
    []
  );

  const initials = useMemo(
    () => getInitials(user.name),
    [getInitials, user.name]
  );

  const formatRole = (role?: string) => {
    if (!role) return "Staff";
    return role
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <Sidebar
      variant="inset"
      className="border-r border-border/50 bg-sidebar/95 backdrop-blur-md"
    >
      <SidebarHeader className="border-b border-border/50">
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
            <Heart className="h-5 w-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold truncate">EverKind Staff</span>
            <span className="text-xs text-muted-foreground truncate">
              Staff Portal
            </span>
          </div>
        </div>
      </SidebarHeader>

      <Separator />

      <SidebarContent className="overflow-x-hidden">
        {STAFF_NAVIGATION_ITEMS.map((section, index) => (
          <div key={section.title}>
            <SidebarGroup>
              <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => {
                    const isActive =
                      pathname === item.url ||
                      (item.url !== "/staff" && pathname.startsWith(item.url));
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          tooltip={item.description}
                          className="transition-all duration-200 hover:scale-[1.02]"
                        >
                          <Link
                            href={item.url}
                            prefetch={true}
                            className="flex items-center gap-3 w-full"
                          >
                            <item.icon className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate font-medium">
                              {item.title}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            {index < STAFF_NAVIGATION_ITEMS.length - 1 && (
              <SidebarSeparator className="my-2" />
            )}
          </div>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 transition-all duration-200"
                >
                  <Avatar className="h-9 w-9 rounded-xl border-2 border-blue-500/20">
                    <AvatarImage
                      src={user.image || undefined}
                      alt={user.name}
                    />
                    <AvatarFallback className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                    <span className="truncate font-bold">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Badge variant="info" className="h-5 text-[10px] px-2">
                      {formatRole(staffRole)}
                    </Badge>
                    <ChevronUp className="ml-auto size-4" />
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  <Link href="/staff/profile">
                    <Settings className="h-4 w-4 mr-2" />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <LogoutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default memo(StaffSidebarComponent);
