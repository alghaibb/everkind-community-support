/**
 * Prefetch critical routes on mount
 * Speeds up navigation to commonly accessed pages
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface PrefetchRoutesProps {
  routes: string[];
}

export function PrefetchRoutes({ routes }: PrefetchRoutesProps) {
  const router = useRouter();

  useEffect(() => {
    // Prefetch routes after initial render
    // Small delay to avoid blocking main thread
    const timeoutId = setTimeout(() => {
      routes.forEach((route) => {
        router.prefetch(route);
      });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [router, routes]);

  return null;
}

/**
 * Prefetch staff routes for authenticated staff members
 */
export function PrefetchStaffRoutes() {
  return (
    <PrefetchRoutes
      routes={[
        "/staff",
        "/staff/schedule",
        "/staff/available-shifts",
        "/staff/timesheets",
      ]}
    />
  );
}

/**
 * Prefetch admin routes for administrators
 */
export function PrefetchAdminRoutes() {
  return (
    <PrefetchRoutes
      routes={[
        "/admin",
        "/admin/staff",
        "/admin/participants",
        "/admin/careers",
        "/admin/messages",
        "/admin/shift-requests",
        "/admin/available-shifts",
      ]}
    />
  );
}
