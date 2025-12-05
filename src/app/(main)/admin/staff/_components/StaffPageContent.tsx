"use client";

import { useSearchParams } from "next/navigation";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import StaffTable from "./StaffTable";
import StaffSearch from "./StaffSearch";
import StaffStats from "./StaffStats";
import { useStaffList } from "@/lib/queries/admin-queries";
import { exportStaffToCSV } from "@/lib/export-utils";
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
    <div className="space-y-6 xs:space-y-7 sm:space-y-8 w-full min-w-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
            Staff Management
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage team members, roles, and staff information.
          </p>
        </div>
        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            if (data.staff) {
              exportStaffToCSV(data.staff);
            }
          }}
          disabled={!data.staff?.length}
          className="gap-2 w-full sm:w-auto shrink-0"
        >
          <Download className="h-4 w-4" />
          <span className="hidden xs:inline">Export CSV</span>
          <span className="xs:hidden">Export</span>
        </Button>
      </div>

      <StaffStats stats={data.stats} />
      <StaffSearch />
      <StaffTable
        staff={data.staff || []}
        totalPages={data.totalPages || 1}
        currentPage={data.currentPage || 1}
      />
    </div>
  );
}
