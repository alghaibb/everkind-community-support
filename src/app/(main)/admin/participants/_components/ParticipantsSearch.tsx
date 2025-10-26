"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import dynamic from "next/dynamic";
import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";

const Select = dynamic(
  () => import("@/components/ui/select").then((mod) => mod.Select),
  { ssr: false }
);
const SelectContent = dynamic(
  () => import("@/components/ui/select").then((mod) => mod.SelectContent),
  { ssr: false }
);
const SelectItem = dynamic(
  () => import("@/components/ui/select").then((mod) => mod.SelectItem),
  { ssr: false }
);
const SelectTrigger = dynamic(
  () => import("@/components/ui/select").then((mod) => mod.SelectTrigger),
  { ssr: false }
);
const SelectValue = dynamic(
  () => import("@/components/ui/select").then((mod) => mod.SelectValue),
  { ssr: false }
);

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "PENDING", label: "Pending" },
  { value: "DISCHARGED", label: "Discharged" },
];

export default function ParticipantsSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const status = searchParams.get("status") || "";
  const disability = searchParams.get("disability") || "";
  const supportCoordinator = searchParams.get("supportCoordinator") || "";

  const handleRoleChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value && value !== "all") {
        params.set("status", value);
      } else {
        params.delete("status");
      }

      // Reset to page 1 when filters change
      params.set("page", "1");

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const handleDisabilityChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set("disability", value);
      } else {
        params.delete("disability");
      }

      params.set("page", "1");

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const handleCoordinatorChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set("supportCoordinator", value);
      } else {
        params.delete("supportCoordinator");
      }

      params.set("page", "1");

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const handleClear = useCallback(() => {
    router.push("/admin/participants");
  }, [router]);

  const hasActiveFilters =
    searchParams.get("search") || status || disability || supportCoordinator;

  return (
    <div className="space-y-4 w-full">
      {/* Search and Filter Controls */}
      <div className="flex flex-col gap-4 sm:flex-row w-full">
        <div className="flex-1 min-w-0">
          <SearchInput placeholder="Search by name or NDIS number..." />
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto">
          <Select value={status} onValueChange={handleRoleChange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <input
            type="text"
            placeholder="Disability..."
            value={disability}
            onChange={(e) => handleDisabilityChange(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-48 min-w-0"
          />

          <input
            type="text"
            placeholder="Coordinator..."
            value={supportCoordinator}
            onChange={(e) => handleCoordinatorChange(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-48 min-w-0"
          />

          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={handleClear}
              className="shrink-0 w-full sm:w-auto"
            >
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
