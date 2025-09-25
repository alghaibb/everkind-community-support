"use client";

import { useSearchParams } from "next/navigation";
import CareersTable from "./CareersTable";
import CareersSearch from "./CareersSearch";
import CareersStats from "./CareersStats";
import { useCareerApplicationsSuspense } from "@/lib/queries/admin-queries";

export function CareersPageContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const role = searchParams.get("role");
  const page = parseInt(searchParams.get("page") || "1");

  const { data } = useCareerApplicationsSuspense({
    search: search || undefined,
    role: role || undefined,
    page,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Career Applications</h1>
        <p className="text-muted-foreground">
          Manage and review job applications from potential staff members.
        </p>
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
