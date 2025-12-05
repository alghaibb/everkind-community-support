"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ClipboardList,
  Clock,
  Plus,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  Calendar,
} from "lucide-react";
import { useTimesheets } from "@/lib/queries/staff-queries";
import { TimesheetsSkeleton } from "./TimesheetsSkeleton";
import { TIMESHEET_STATUS } from "../../constants";
import { format } from "date-fns";

export function TimesheetsContent() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { data, isLoading, error } = useTimesheets(
    statusFilter === "all" ? undefined : statusFilter
  );

  if (isLoading) {
    return <TimesheetsSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Failed to load timesheets
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

  const entries = data?.entries || [];

  const statsCards = [
    {
      title: "Weekly Hours",
      value: `${data?.weeklyHours || 0}h`,
      icon: Clock,
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Monthly Hours",
      value: `${data?.monthlyHours || 0}h`,
      icon: Calendar,
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Pending",
      value: data?.pendingCount || 0,
      icon: FileText,
      color: "from-amber-500 to-orange-600",
    },
    {
      title: "Approved",
      value: data?.approvedCount || 0,
      icon: CheckCircle2,
      color: "from-green-500 to-emerald-600",
    },
  ];

  return (
    <div className="space-y-6 xs:space-y-7 sm:space-y-8 w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
            Timesheets
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Log your work hours and track approvals
          </p>
        </div>
        <Button
          size="lg"
          className="gap-2 shrink-0 w-full sm:w-auto shadow-glow hover:shadow-glow-lg"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden xs:inline">New Timesheet Entry</span>
          <span className="xs:hidden">New Entry</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="border-border/50 shadow-soft-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color}`}
                  >
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.title}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filter Tabs */}
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="DRAFT">Drafts</TabsTrigger>
          <TabsTrigger value="SUBMITTED">Submitted</TabsTrigger>
          <TabsTrigger value="APPROVED">Approved</TabsTrigger>
          <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Entries List */}
      <Card className="border-border/50 shadow-soft-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Timesheet Entries
          </CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">
                No timesheet entries
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                You haven&apos;t logged any hours yet. Click &quot;New
                Entry&quot; to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry, index) => {
                const statusConfig =
                  TIMESHEET_STATUS[
                    entry.status as keyof typeof TIMESHEET_STATUS
                  ] || TIMESHEET_STATUS.DRAFT;

                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors border border-border/30"
                  >
                    {/* Date */}
                    <div className="flex items-center gap-3 sm:min-w-[140px]">
                      <div className="flex flex-col items-center justify-center min-w-[50px] p-2 rounded-lg bg-primary/10 text-primary">
                        <span className="text-xs font-medium">
                          {format(new Date(entry.workDate), "EEE")}
                        </span>
                        <span className="text-lg font-bold">
                          {format(new Date(entry.workDate), "d")}
                        </span>
                      </div>
                      <div className="sm:hidden">
                        <p className="font-medium">{entry.serviceType}</p>
                        <p className="text-sm text-muted-foreground">
                          {entry.totalHours}h • {entry.location}
                        </p>
                      </div>
                    </div>

                    {/* Details - Desktop */}
                    <div className="hidden sm:flex flex-1 items-center gap-4">
                      <div className="flex-1">
                        <p className="font-medium">{entry.serviceType}</p>
                        <p className="text-sm text-muted-foreground">
                          {entry.startTime} - {entry.endTime}
                          {entry.participant && (
                            <span>
                              {" "}
                              • {entry.participant.firstName}{" "}
                              {entry.participant.lastName}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{entry.totalHours}h</p>
                        <p className="text-xs text-muted-foreground">
                          {entry.location}
                        </p>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-2">
                      <Badge variant={statusConfig.variant}>
                        {statusConfig.label}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
