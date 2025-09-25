import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, Briefcase, Eye, Plus } from "lucide-react";
import Link from "next/link";

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header - Static */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Loading dashboard data...</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions - Static */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Briefcase className="h-5 w-5" />
              Career Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Review and manage job applications from potential staff members.
            </p>
            <Button asChild>
              <Link href="/admin/careers">
                <Eye className="mr-2 h-4 w-4" />
                View Applications
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-5 w-5" />
              Contact Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Respond to inquiries and support requests from families.
            </p>
            <Button asChild>
              <Link href="/admin/messages">
                <Eye className="mr-2 h-4 w-4" />
                View Messages
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5" />
              Staff Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Manage team members, roles, and account settings.
            </p>
            <Button asChild>
              <Link href="/admin/staff">
                <Plus className="mr-2 h-4 w-4" />
                Manage Staff
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity - Only skeleton the data */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function AdminStatsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 mb-1" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  );
}
