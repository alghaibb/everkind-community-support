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
import { useDashboardStatsSuspense } from "@/lib/queries/admin-queries";
import { RecentApplication, RecentMessage } from "@/lib/types/admin";

export function DashboardContent({ userName }: { userName: string }) {
  const { data: stats } = useDashboardStatsSuspense();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {userName}. Here&apos;s what&apos;s happening at
          EverKind.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.staff.total}</div>
            <p className="text-xs text-muted-foreground">Active team members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Applications
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.applications.total}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.applications.weekly} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Contact Messages
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.messages.total}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.messages.weekly} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Growth
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.applications.monthly + stats.messages.monthly}
            </div>
            <p className="text-xs text-muted-foreground">
              Combined activity this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
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

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
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

        <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
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
