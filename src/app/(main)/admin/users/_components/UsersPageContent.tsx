"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUsersList } from "@/lib/queries/admin-queries";
import { Users, UserCheck, Shield, Building, Search } from "lucide-react";
import { UsersSkeleton } from "./UsersSkeleton";
import { UsersTable } from "./UsersTable";
import { Label } from "@/components/ui/label";

export function UsersPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const role = searchParams.get("role") || "all";
  const userType = searchParams.get("userType") || "all";
  const status = searchParams.get("status") || "all";

  const updateSearchParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  const clearFilters = useCallback(() => {
    router.push("/admin/users", { scroll: false });
  }, [router]);

  const { data, isLoading, error } = useUsersList({
    search: search || undefined,
    role: role === "all" ? undefined : role,
    userType: userType === "all" ? undefined : userType,
    status: status === "all" ? undefined : status,
  });

  if (isLoading) {
    return <UsersSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Failed to load users
              </h3>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error ? error.message : "An error occurred"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = data?.stats;

  return (
    <div className="space-y-6 xs:space-y-7 sm:space-y-8 w-full min-w-0">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
          Users Management
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Manage all users including admins, staff, and family members
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 xs:gap-5 sm:gap-6 grid-cols-1 xs:grid-cols-2 xl:grid-cols-4">
          <Card className="hover:scale-[1.02] transition-transform duration-300 animate-scale-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-xs xs:text-sm font-semibold truncate">
                Total Users
              </CardTitle>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 shrink-0">
                <Users className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl xs:text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
                {stats.total}
              </div>
            </CardContent>
          </Card>

          <Card
            className="hover:scale-[1.02] transition-transform duration-300 animate-scale-in"
            style={{ animationDelay: "0.05s" }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-xs xs:text-sm font-semibold truncate">
                Active Users
              </CardTitle>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 shrink-0">
                <UserCheck className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl xs:text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
                {stats.active}
              </div>
              <div className="text-xs text-muted-foreground mt-1 truncate">
                {stats.inactive} inactive
              </div>
            </CardContent>
          </Card>

          <Card
            className="hover:scale-[1.02] transition-transform duration-300 animate-scale-in"
            style={{ animationDelay: "0.1s" }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-xs xs:text-sm font-semibold truncate">
                Admin & Staff
              </CardTitle>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 shrink-0">
                <Shield className="h-4 w-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl xs:text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
                {stats.admins + stats.staff}
              </div>
              <div className="text-xs text-muted-foreground mt-1 truncate">
                {stats.admins} admins, {stats.staff} staff
              </div>
            </CardContent>
          </Card>

          <Card
            className="hover:scale-[1.02] transition-transform duration-300 animate-scale-in"
            style={{ animationDelay: "0.15s" }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-xs xs:text-sm font-semibold truncate">
                User Types
              </CardTitle>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 shrink-0">
                <Building className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl xs:text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
                {stats.internal}
              </div>
              <div className="text-xs text-muted-foreground mt-1 truncate">
                Internal: {stats.internal}, Family: {stats.family}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Search className="h-5 w-5 shrink-0" />
            <span className="truncate">Search & Filter Users</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Search</Label>
              <SearchInput
                placeholder="Search by name or email..."
                onSearch={(value) => updateSearchParam("search", value)}
                className="w-full pl-10"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Role</Label>
              <Select
                value={role}
                onValueChange={(value) => updateSearchParam("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="STAFF">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">User Type</Label>
              <Select
                value={userType}
                onValueChange={(value) => updateSearchParam("userType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="INTERNAL">Internal</SelectItem>
                  <SelectItem value="FAMILY">Family</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <Select
                value={status}
                onValueChange={(value) => updateSearchParam("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <UsersTable users={data?.users || []} />
    </div>
  );
}
