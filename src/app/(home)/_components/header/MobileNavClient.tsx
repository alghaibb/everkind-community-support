"use client";

import { useState } from "react";
import Link from "next/link";
import { navLinks } from "../../constants";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, ChevronDown, ChevronRight } from "lucide-react";
import LogoutButton from "@/components/logout-button";
import {
  User,
  Settings,
  LayoutDashboard,
  Users,
  MessageSquare,
  Shield,
  Heart,
  Calendar,
  CalendarPlus,
  ClipboardList,
  Bell,
  UserCircle,
} from "lucide-react";

interface MobileNavClientProps {
  user?: {
    name: string;
    email: string;
    image?: string | null;
    role?: string;
  };
}

export default function MobileNavClient({ user }: MobileNavClientProps) {
  const [open, setOpen] = useState(false);
  const [expandedServices, setExpandedServices] = useState(false);
  const isAdmin = user?.role === "ADMIN";
  const isStaff = user?.role === "STAFF";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <SheetTitle className="sr-only">Toggle menu</SheetTitle>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[300px] sm:w-[400px] flex flex-col"
      >
        <nav className="flex flex-col space-y-4 mt-8 flex-1 min-h-0 overflow-y-auto">
          {navLinks.map((link) => (
            <div key={link.href}>
              {link.subLinks ? (
                <div>
                  <Button
                    variant="ghost"
                    className="w-full justify-between px-3 py-2 text-base font-medium hover:text-primary transition-colors"
                    onClick={() => setExpandedServices(!expandedServices)}
                  >
                    {link.label}
                    {expandedServices ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                  {expandedServices && (
                    <div className="ml-4 mt-2 space-y-2">
                      {link.subLinks.map((subLink) => (
                        <Link
                          key={subLink.href}
                          href={subLink.href}
                          className="block px-3 py-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                          onClick={() => setOpen(false)}
                        >
                          {subLink.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={link.href}
                  className="block px-3 py-2 text-base font-medium hover:text-primary transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              )}
            </div>
          ))}

          {user ? (
            <>
              {/* Staff Portal Links */}
              {isStaff && (
                <>
                  <div className="border-t border-border my-4" />
                  <div className="px-3 py-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Staff Portal
                    </p>
                    <div className="space-y-1">
                      <Link
                        href="/staff"
                        className="flex items-center px-3 py-2 text-sm font-medium hover:text-primary transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                      <Link
                        href="/staff/schedule"
                        className="flex items-center px-3 py-2 text-sm font-medium hover:text-primary transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        My Schedule
                      </Link>
                      <Link
                        href="/staff/available-shifts"
                        className="flex items-center px-3 py-2 text-sm font-medium hover:text-primary transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        <CalendarPlus className="mr-2 h-4 w-4" />
                        Available Shifts
                      </Link>
                      <Link
                        href="/staff/participants"
                        className="flex items-center px-3 py-2 text-sm font-medium hover:text-primary transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        <Users className="mr-2 h-4 w-4" />
                        My Participants
                      </Link>
                      <Link
                        href="/staff/timesheets"
                        className="flex items-center px-3 py-2 text-sm font-medium hover:text-primary transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        <ClipboardList className="mr-2 h-4 w-4" />
                        Timesheets
                      </Link>
                      <Link
                        href="/staff/notifications"
                        className="flex items-center px-3 py-2 text-sm font-medium hover:text-primary transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        <Bell className="mr-2 h-4 w-4" />
                        Notifications
                      </Link>
                      <Link
                        href="/staff/profile"
                        className="flex items-center px-3 py-2 text-sm font-medium hover:text-primary transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        <UserCircle className="mr-2 h-4 w-4" />
                        My Profile
                      </Link>
                    </div>
                  </div>
                </>
              )}

              {/* Generic user links (only show if not staff) */}
              {!isStaff && (
            <>
              <div className="border-t border-border my-4" />
              <Link
                href="/profile"
                className="flex items-center px-3 py-2 text-base font-medium hover:text-primary transition-colors"
                onClick={() => setOpen(false)}
              >
                <User className="mr-3 h-4 w-4" />
                Profile
              </Link>
              <Link
                href="/settings"
                className="flex items-center px-3 py-2 text-base font-medium hover:text-primary transition-colors"
                onClick={() => setOpen(false)}
              >
                <Settings className="mr-3 h-4 w-4" />
                Settings
              </Link>
                </>
              )}

              {/* Admin Panel Links */}
              {isAdmin && (
                <>
                  <div className="border-t border-border my-4" />
                  <div className="px-3 py-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Admin Panel
                    </p>
                    <div className="space-y-1">
                      <Link
                        href="/admin"
                        className="flex items-center px-3 py-2 text-sm font-medium hover:text-primary transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                      <Link
                        href="/admin/careers"
                        className="flex items-center px-3 py-2 text-sm font-medium hover:text-primary transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        <Users className="mr-2 h-4 w-4" />
                        Career Applications
                      </Link>
                      <Link
                        href="/admin/messages"
                        className="flex items-center px-3 py-2 text-sm font-medium hover:text-primary transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Contact Messages
                      </Link>
                      <Link
                        href="/admin/staff"
                        className="flex items-center px-3 py-2 text-sm font-medium hover:text-primary transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Staff Management
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            // Guest user login options
            <div className="space-y-2 px-3">
              <div className="text-sm font-medium text-muted-foreground mb-3">
                Choose your portal:
              </div>

              <Link
                href="/staff-login"
                className="flex items-center px-3 py-3 text-base font-medium hover:text-primary transition-colors border rounded-md hover:bg-accent"
                onClick={() => setOpen(false)}
              >
                <Users className="mr-3 h-5 w-5" />
                <div className="flex flex-col">
                  <span>Staff Portal</span>
                  <span className="text-xs text-muted-foreground">
                    For staff and administrators
                  </span>
                </div>
              </Link>

              <Link
                href="/family-login"
                className="flex items-center px-3 py-3 text-base font-medium hover:text-primary transition-colors border rounded-md hover:bg-accent"
                onClick={() => setOpen(false)}
              >
                <Heart className="mr-3 h-5 w-5" />
                <div className="flex flex-col">
                  <span>Family Portal</span>
                  <span className="text-xs text-muted-foreground">
                    For family members
                  </span>
                </div>
              </Link>
            </div>
          )}
        </nav>

        {user && (
          <div className="border-t border-border">
            <LogoutButton variant="ghost" />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
