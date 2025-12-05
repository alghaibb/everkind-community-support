"use client";

import { useSearchParams } from "next/navigation";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import CareersTable from "./CareersTable";
import CareersSearch from "./CareersSearch";
import CareersStats from "./CareersStats";
import { useCareerApplicationsSuspense } from "@/lib/queries/admin-queries";
import { exportCareersToCSV } from "@/lib/export-utils";
import { CareersTableSkeleton } from "./CareersTableSkeleton";

export function CareersPageContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const role = searchParams.get("role");
  const page = parseInt(searchParams.get("page") || "1");

  const { data, isLoading } = useCareerApplicationsSuspense({
    search: search || undefined,
    role: role || undefined,
    page,
  });

  if (isLoading || !data) {
    return <CareersTableSkeleton />;
  }

  return (
    <div className="space-y-6 xs:space-y-7 sm:space-y-8 w-full min-w-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
            Career Applications
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage and review job applications from potential staff members.
          </p>
        </div>
        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            if (data.applications) {
              exportCareersToCSV(data.applications);
            }
          }}
          disabled={!data.applications?.length}
          className="gap-2 w-full sm:w-auto shrink-0"
        >
          <Download className="h-4 w-4" />
          <span className="hidden xs:inline">Export CSV</span>
          <span className="xs:hidden">Export</span>
        </Button>
      </div>

      <CareersStats stats={data.stats} />
      <CareersSearch />
      <CareersTable
        applications={data.applications}
        totalPages={data.totalPages}
        currentPage={data.currentPage}
      />
    </div>
  );
}
