"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Filter } from "lucide-react";
import { STAFF_ROLE_OPTIONS } from "../../constants";

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
] as const;

export default function StaffSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [role, setRole] = useState(searchParams.get("role") || "all");
  const [status, setStatus] = useState(searchParams.get("status") || "all");

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

    router.push(`/admin/staff?${params.toString()}`);
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    const params = new URLSearchParams(searchParams.toString());

    if (newStatus && newStatus !== "all") {
      params.set("status", newStatus);
    } else {
      params.delete("status");
    }

    // Reset to page 1 when filtering
    params.set("page", "1");

    router.push(`/admin/staff?${params.toString()}`);
  };

  const handleClear = () => {
    setRole("all");
    setStatus("all");
    router.push("/admin/staff");
  };

  const hasActiveFilters =
    searchParams.get("search") || (role && role !== "all") || (status && status !== "all");

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <SearchInput placeholder="Search by name, email, or employee ID..." />
        </div>

        <div className="flex gap-2 sm:gap-4">
          <Select value={role} onValueChange={handleRoleChange}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {STAFF_ROLE_OPTIONS.map((roleOption) => (
                <SelectItem key={roleOption.value} value={roleOption.value}>
                  {roleOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((statusOption) => (
                <SelectItem key={statusOption.value} value={statusOption.value}>
                  {statusOption.label}
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
              Role: {STAFF_ROLE_OPTIONS.find(r => r.value === role)?.label || role}
            </Badge>
          )}
          {status && status !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Status: {STATUS_OPTIONS.find(s => s.value === status)?.label || status}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
