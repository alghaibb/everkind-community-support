"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Users,
  ClipboardList,
  ArrowRight,
  CalendarPlus,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useStaffDashboard } from "@/lib/queries/staff-queries";
import { StaffDashboardSkeleton } from "./StaffDashboardSkeleton";
import { TodaySchedule } from "./TodaySchedule";
import { QuickActions } from "./QuickActions";

export function StaffDashboardContent() {
  const { data, isLoading, error } = useStaffDashboard();

  if (isLoading) {
    return <StaffDashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Failed to load dashboard
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

  const stats = data?.stats || {
    todayShifts: 0,
    weekHours: 0,
    assignedParticipants: 0,
    pendingTimesheets: 0,
  };

  const statsCards = [
    {
      title: "Today's Shifts",
      value: stats.todayShifts,
      description: "Scheduled for today",
      icon: Calendar,
      color: "from-blue-500 to-indigo-600",
      href: "/staff/schedule",
    },
    {
      title: "Hours This Week",
      value: `${stats.weekHours}h`,
      description: "Logged hours",
      icon: Clock,
      color: "from-emerald-500 to-teal-600",
      href: "/staff/timesheets",
    },
    {
      title: "My Participants",
      value: stats.assignedParticipants,
      description: "Currently assigned",
      icon: Users,
      color: "from-violet-500 to-purple-600",
      href: "/staff/participants",
    },
    {
      title: "Pending Timesheets",
      value: stats.pendingTimesheets,
      description: "Awaiting approval",
      icon: ClipboardList,
      color: "from-amber-500 to-orange-600",
      href: "/staff/timesheets",
    },
  ];

  return (
    <div className="space-y-6 xs:space-y-7 sm:space-y-8 w-full min-w-0">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
            Welcome back, {data?.staffName?.split(" ")[0] || "Staff"}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Here&apos;s an overview of your schedule and tasks
          </p>
        </div>
        <Button
          asChild
          size="lg"
          className="gap-2 shrink-0 w-full sm:w-auto shadow-glow hover:shadow-glow-lg"
        >
          <Link href="/staff/available-shifts">
            <CalendarPlus className="h-4 w-4" />
            <span className="hidden xs:inline">Browse Available Shifts</span>
            <span className="xs:hidden">Available Shifts</span>
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 xs:gap-5 sm:gap-6 grid-cols-1 xs:grid-cols-2 xl:grid-cols-4 w-full min-w-0">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Link href={stat.href}>
              <Card className="w-full hover:scale-[1.02] transition-all duration-300 cursor-pointer group border-border/50 shadow-soft-lg hover:shadow-glow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-xs xs:text-sm font-semibold truncate">
                    {stat.title}
                  </CardTitle>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-lg shrink-0`}
                  >
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl xs:text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate flex items-center gap-1">
                    {stat.description}
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Schedule - Takes 2 columns */}
        <div className="lg:col-span-2">
          <Card className="border-border/50 shadow-soft-lg animate-slide-up">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <CardTitle className="text-base sm:text-lg">
                  Today&apos;s Schedule
                </CardTitle>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/staff/schedule">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <TodaySchedule shifts={data?.todayShifts || []} />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card
            className="border-border/50 shadow-soft-lg animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle className="text-base sm:text-lg">
                  Quick Actions
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <QuickActions />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pending Items Section */}
      {(data?.pendingRequests?.length > 0 ||
        data?.pendingTimesheets?.length > 0) && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Pending Shift Requests */}
          {data?.pendingRequests?.length > 0 && (
            <Card className="border-border/50 shadow-soft-lg animate-slide-up">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    <CardTitle className="text-base sm:text-lg">
                      Pending Shift Requests
                    </CardTitle>
                  </div>
                  <Badge variant="warning">{data.pendingRequests.length}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.pendingRequests
                    .slice(0, 3)
                    .map(
                      (request: {
                        id: string;
                        shiftDate: string;
                        startTime: string;
                        endTime: string;
                      }) => (
                        <div
                          key={request.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <div>
                            <p className="font-medium text-sm">
                              {new Date(request.shiftDate).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {request.startTime} - {request.endTime}
                            </p>
                          </div>
                          <Badge variant="warning">Pending</Badge>
                        </div>
                      )
                    )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pending Timesheets */}
          {data?.pendingTimesheets?.length > 0 && (
            <Card className="border-border/50 shadow-soft-lg animate-slide-up">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-amber-500" />
                    <CardTitle className="text-base sm:text-lg">
                      Timesheets Awaiting Approval
                    </CardTitle>
                  </div>
                  <Badge variant="warning">
                    {data.pendingTimesheets.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.pendingTimesheets
                    .slice(0, 3)
                    .map(
                      (timesheet: {
                        id: string;
                        workDate: string;
                        totalHours: number;
                        status: string;
                      }) => (
                        <div
                          key={timesheet.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <div>
                            <p className="font-medium text-sm">
                              {new Date(
                                timesheet.workDate
                              ).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {timesheet.totalHours} hours
                            </p>
                          </div>
                          <Badge variant="warning">Submitted</Badge>
                        </div>
                      )
                    )}
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/staff/timesheets">View All Timesheets</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
