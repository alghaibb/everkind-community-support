"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  Users,
  UserCheck,
  Activity,
  Plus,
  Filter,
} from "lucide-react";
import { SchedulingCalendar } from "./SchedulingCalendar";
import { StaffRoster } from "./StaffRoster";
import { AppointmentsTable } from "./AppointmentsTable";
import { ServiceTracking } from "./ServiceTracking";
import { SchedulingSkeleton } from "./SchedulingSkeleton";
import {
  useTodayAppointments,
  useStaffShifts,
  useServiceLogs,
} from "@/lib/queries/admin-queries";

export function SchedulingPageContent() {
  const [activeTab, setActiveTab] = useState("calendar");

  // Get real data for stats
  const { data: todayAppointments, isLoading: loadingToday } =
    useTodayAppointments();
  const { data: currentWeekStaff, isLoading: loadingStaff } = useStaffShifts(
    "",
    "current"
  );
  const { data: todayServices, isLoading: loadingServices } = useServiceLogs(
    "",
    "",
    1
  );

  // Show skeleton while loading
  const isLoading = loadingToday || loadingStaff || loadingServices;

  // Calculate stats from real data
  const todayStats = todayAppointments?.appointments || [];
  const staffStats = currentWeekStaff?.stats;
  const serviceStats = todayServices?.stats;

  // Calculate today's service hours (from completed services today)
  const todayServiceHours =
    todayServices?.serviceLogs
      .filter((log) => {
        const today = new Date().toISOString().split("T")[0];
        return log.serviceDate === today && log.status === "COMPLETED";
      })
      .reduce((total, log) => total + Number(log.actualHours), 0) || 0;

  if (isLoading) {
    return <SchedulingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scheduling</h1>
          <p className="text-muted-foreground">
            Manage staff schedules, participant appointments, and service
            delivery
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today&apos;s Appointments
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.length}</div>
            <p className="text-xs text-muted-foreground">
              {todayStats.filter((a) => a.status === "CONFIRMED").length}{" "}
              confirmed,{" "}
              {todayStats.filter((a) => a.status === "PENDING").length} pending
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Staff This Week
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {staffStats?.totalStaff || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Staff scheduled this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Service Hours Today
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todayServiceHours.toFixed(1)}h
            </div>
            <p className="text-xs text-muted-foreground">
              Completed services today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Services
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {serviceStats?.completed || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Services completed this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Scheduling Interface */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="roster" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Staff Roster
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Appointments
          </TabsTrigger>
          <TabsTrigger value="tracking" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Service Tracking
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <SchedulingCalendar />
        </TabsContent>

        <TabsContent value="roster" className="space-y-4">
          <StaffRoster />
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <AppointmentsTable />
        </TabsContent>

        <TabsContent value="tracking" className="space-y-4">
          <ServiceTracking />
        </TabsContent>
      </Tabs>
    </div>
  );
}
