"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  MapPin,
  User,
  AlertCircle,
} from "lucide-react";
import { useStaffSchedule } from "@/lib/queries/staff-queries";
import { ScheduleSkeleton } from "./ScheduleSkeleton";
import { SHIFT_STATUS } from "../../constants";
import {
  format,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  eachDayOfInterval,
  isSameDay,
  isToday,
} from "date-fns";

export function ScheduleContent() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"week" | "list">("week");

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

  const { data, isLoading, error } = useStaffSchedule(
    weekStart.toISOString(),
    weekEnd.toISOString()
  );

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentDate(
      direction === "prev" ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  if (isLoading) {
    return <ScheduleSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Failed to load schedule
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

  const shifts = data?.shifts || [];
  const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getShiftsForDay = (date: Date) => {
    return shifts.filter((shift) => isSameDay(new Date(shift.shiftDate), date));
  };

  return (
    <div className="space-y-6 xs:space-y-7 sm:space-y-8 w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
            My Schedule
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            View and manage your work schedule
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50 shadow-soft-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{shifts.length}</p>
                <p className="text-xs text-muted-foreground">This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-soft-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{data?.weeklyHours || 0}h</p>
                <p className="text-xs text-muted-foreground">Weekly Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Navigation */}
      <Card className="border-border/50 shadow-soft-lg">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateWeek("prev")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateWeek("next")}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={goToToday}>
                Today
              </Button>
              <h2 className="text-lg font-semibold ml-2">
                {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
              </h2>
            </div>
            <Tabs
              value={view}
              onValueChange={(v) => setView(v as "week" | "list")}
            >
              <TabsList>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>

        <CardContent>
          {view === "week" ? (
            // Week View
            <div className="grid grid-cols-7 gap-2">
              {daysOfWeek.map((day, index) => {
                const dayShifts = getShiftsForDay(day);
                const isCurrentDay = isToday(day);

                return (
                  <motion.div
                    key={day.toISOString()}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`min-h-[120px] p-2 rounded-lg border ${
                      isCurrentDay
                        ? "border-primary bg-primary/5"
                        : "border-border/50 bg-muted/20"
                    }`}
                  >
                    <div className="text-center mb-2">
                      <p className="text-xs text-muted-foreground">
                        {format(day, "EEE")}
                      </p>
                      <p
                        className={`text-lg font-bold ${
                          isCurrentDay ? "text-primary" : ""
                        }`}
                      >
                        {format(day, "d")}
                      </p>
                    </div>
                    <div className="space-y-1">
                      {dayShifts.map((shift) => (
                        <div
                          key={shift.id}
                          className="p-1.5 rounded bg-primary/10 text-xs cursor-pointer hover:bg-primary/20 transition-colors"
                        >
                          <p className="font-medium truncate">
                            {shift.startTime}
                          </p>
                        </div>
                      ))}
                      {dayShifts.length === 0 && (
                        <p className="text-xs text-muted-foreground text-center py-2">
                          No shifts
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            // List View
            <div className="space-y-4">
              {shifts.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">
                    No shifts this week
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    You don&apos;t have any shifts scheduled for this week.
                  </p>
                </div>
              ) : (
                shifts.map((shift, index) => {
                  const statusConfig =
                    SHIFT_STATUS[shift.status as keyof typeof SHIFT_STATUS] ||
                    SHIFT_STATUS.SCHEDULED;

                  return (
                    <motion.div
                      key={shift.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors border border-border/30"
                    >
                      <div className="flex flex-col items-center justify-center min-w-[70px] p-3 rounded-lg bg-primary/10 text-primary">
                        <span className="text-xs font-medium">
                          {format(new Date(shift.shiftDate), "EEE")}
                        </span>
                        <span className="text-2xl font-bold">
                          {format(new Date(shift.shiftDate), "d")}
                        </span>
                        <span className="text-xs">
                          {format(new Date(shift.shiftDate), "MMM")}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-semibold truncate">
                              {shift.serviceType || "Support Shift"}
                            </h4>
                            {shift.participant && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                <User className="h-3 w-3" />
                                <span>
                                  {shift.participant.firstName}{" "}
                                  {shift.participant.lastName}
                                </span>
                              </div>
                            )}
                          </div>
                          <Badge variant={statusConfig.variant}>
                            {statusConfig.label}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {shift.startTime} - {shift.endTime}
                            </span>
                          </div>
                          {shift.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate max-w-[200px]">
                                {shift.location}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
