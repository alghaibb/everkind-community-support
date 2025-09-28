"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Filter } from "lucide-react";
import { ROLE_OPTIONS } from "../../constants";
import dynamic from "next/dynamic";

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

export default function CareersSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [role, setRole] = useState(searchParams.get("role") || "all");

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    const params = new URLSearchParams(searchParams.toString());

    if (newRole && newRole !== "all") {
      params.set("role", newRole);
    } else {
      params.delete("role");
    }

    // Reset to page 1 when filtering
    params.set("page", "1");

    router.push(`/admin/careers?${params.toString()}`);
  };

  const handleClear = () => {
    setRole("all");
    router.push("/admin/careers");
  };

  const hasActiveFilters =
    searchParams.get("search") || (role && role !== "all");

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <SearchInput placeholder="Search by name or email..." />
        </div>

        <div className="flex gap-2 sm:gap-4">
          <Select value={role} onValueChange={handleRoleChange}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map((roleOption) => (
                <SelectItem key={roleOption.value} value={roleOption.value}>
                  {roleOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={handleClear}
              className="flex-shrink-0"
            >
              <X className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {searchParams.get("search") && (
            <Badge variant="secondary" className="text-xs">
              Search: &quot;{searchParams.get("search")}&quot;
            </Badge>
          )}
          {role && role !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Role: {role}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
