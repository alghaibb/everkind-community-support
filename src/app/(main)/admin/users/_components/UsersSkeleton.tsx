import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function UsersSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header - Static */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
        <p className="text-muted-foreground">Loading users data...</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Total Users</div>
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Active Users</div>
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-20" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Admin & Staff</div>
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">User Types</div>
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-36" />
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <div className="text-xl font-semibold">Search & Filter Users</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">User Type</label>
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="mt-4">
            <div className="h-10 w-32 bg-muted rounded-md flex items-center justify-center text-sm text-muted-foreground">
              Clear Filters
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <div className="text-xl font-semibold">Users (Loading...)</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            {/* Table Header */}
            <div className="border-b p-4">
              <div className="grid grid-cols-7 gap-4">
                {[
                  "User",
                  "Role",
                  "Type",
                  "Status",
                  "Last Active",
                  "Member Since",
                  "Actions",
                ].map((header, i) => (
                  <div
                    key={i}
                    className="text-sm font-medium text-muted-foreground"
                  >
                    {header}
                  </div>
                ))}
              </div>
            </div>

            {/* Table Rows */}
            {Array.from({ length: 8 }).map((_, rowIndex) => (
              <div key={rowIndex} className="border-b p-4 last:border-b-0">
                <div className="grid grid-cols-7 gap-4 items-center">
                  {/* User */}
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>

                  {/* Role */}
                  <Skeleton className="h-6 w-16" />

                  {/* Type */}
                  <Skeleton className="h-6 w-20" />

                  {/* Status */}
                  <Skeleton className="h-6 w-16" />

                  {/* Last Active */}
                  <Skeleton className="h-4 w-20" />

                  {/* Member Since */}
                  <Skeleton className="h-4 w-20" />

                  {/* Actions */}
                  <div className="flex justify-end">
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
