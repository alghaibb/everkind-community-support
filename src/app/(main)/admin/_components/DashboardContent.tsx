"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Activity,
  FileText,
  MessageSquare,
  Briefcase,
  Eye,
  Plus,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useDashboardStats } from "@/lib/queries/admin-queries";
import { RecentApplication, RecentMessage } from "@/types/admin";
import { AdminDashboardSkeleton } from "./AdminDashboardSkeleton";

export function DashboardContent({ userName }: { userName: string }) {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading || !stats) {
    return <AdminDashboardSkeleton />;
  }

  if (error) {
    console.error("Dashboard error:", error);
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {userName}.</p>
        </div>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">
            Failed to load dashboard data. Please try refreshing the page.
          </p>
          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 xs:space-y-7 sm:space-y-8 w-full min-w-0">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
          Dashboard
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Welcome back, {userName}. Here&apos;s what&apos;s happening at
          EverKind.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 xs:gap-5 sm:gap-6 grid-cols-1 xs:grid-cols-2 xl:grid-cols-4">
        <Card className="hover:scale-[1.02] transition-transform duration-300 animate-scale-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-xs xs:text-sm font-semibold truncate">
              Total Staff
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 shrink-0">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl xs:text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
              {stats.staff.total}
            </div>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              Active team members
            </p>
          </CardContent>
        </Card>

        <Card
          className="hover:scale-[1.02] transition-transform duration-300 animate-scale-in"
          style={{ animationDelay: "0.05s" }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-xs xs:text-sm font-semibold truncate">
              Total Applications
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 shrink-0">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl xs:text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
              {stats.applications.total}
            </div>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              +{stats.applications.weekly} this week
            </p>
          </CardContent>
        </Card>

        <Card
          className="hover:scale-[1.02] transition-transform duration-300 animate-scale-in"
          style={{ animationDelay: "0.1s" }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-xs xs:text-sm font-semibold truncate">
              Contact Messages
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 shrink-0">
              <MessageSquare className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl xs:text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
              {stats.messages.total}
            </div>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              +{stats.messages.weekly} this week
            </p>
          </CardContent>
        </Card>

        <Card
          className="hover:scale-[1.02] transition-transform duration-300 animate-scale-in"
          style={{ animationDelay: "0.15s" }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-xs xs:text-sm font-semibold truncate">
              Monthly Growth
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 shrink-0">
              <Activity className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl xs:text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
              {stats.applications.monthly + stats.messages.monthly}
            </div>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              Combined activity this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 xs:gap-5 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 shrink-0">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <span className="truncate">Career Applications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Review and manage job applications from potential staff members.
            </p>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/admin/careers">
                <Eye className="mr-2 h-4 w-4" />
                View Applications
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 shrink-0">
                <MessageSquare className="h-5 w-5 text-green-600" />
              </div>
              <span className="truncate">Contact Messages</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Respond to inquiries and support requests from families.
            </p>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/admin/messages">
                <Eye className="mr-2 h-4 w-4" />
                View Messages
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 shrink-0">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <span className="truncate">Staff Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Manage team members, roles, and account settings.
            </p>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/admin/staff">
                <Plus className="mr-2 h-4 w-4" />
                Manage Staff
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 xs:gap-5 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              Recent Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recent.applications.length > 0 ? (
              <div className="space-y-4">
                {stats.recent.applications.map(
                  (application: RecentApplication) => (
                    <div
                      key={application.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">
                          {application.firstName} {application.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {application.role}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">
                          {formatDistanceToNow(
                            new Date(application.createdAt),
                            {
                              addSuffix: true,
                            }
                          )}
                        </Badge>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No recent applications
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              Recent Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recent.messages.length > 0 ? (
              <div className="space-y-4">
                {stats.recent.messages.map((message: RecentMessage) => (
                  <div
                    key={message.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">
                        {message.firstName} {message.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {message.subject}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(message.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No recent messages
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
