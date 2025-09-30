"use client";

import { useSearchParams } from "next/navigation";
import StaffTable from "./StaffTable";
import StaffSearch from "./StaffSearch";
import StaffStats from "./StaffStats";
import { useStaffList } from "@/lib/queries/admin-queries";
import { StaffTableSkeleton } from "./StaffTableSkeleton";

export function StaffPageContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const role = searchParams.get("role");
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") || "1");

  const { data, isLoading, error } = useStaffList({
    search: search || undefined,
    role: role || undefined,
    status: status || undefined,
    page,
  });

  if (isLoading || !data || !data.staff || !data.stats) {
    return <StaffTableSkeleton />;
  }

  if (error) {
    console.error("Staff list error:", error);
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load staff data</p>
        <p className="text-sm text-muted-foreground mt-2">
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <p className="text-muted-foreground">
          Manage team members, roles, and staff information.
        </p>
      </div>

      <StaffStats stats={data.stats} />
      <StaffSearch />
      <StaffTable
        staff={data.staff}
        totalPages={data.totalPages}
        currentPage={data.currentPage}
      />
    </div>
  );
}
