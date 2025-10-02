"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  User,
  Filter,
  X as XIcon,
} from "lucide-react";
import { format } from "date-fns";
import { useTodayAppointments } from "@/lib/queries/admin-queries";

export function SchedulingCalendar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [date, setDate] = useState<Date | undefined>(new Date());

  const view =
    (searchParams.get("view") as "month" | "week" | "day") || "month";

  const handleViewChange = (newView: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newView && newView !== "month") {
      params.set("view", newView);
    } else {
      params.delete("view");
    }

    router.push(`/admin/scheduling?${params.toString()}`, { scroll: false });
  };

  const handleClearFilters = () => {
    router.push("/admin/scheduling", { scroll: false });
  };

  const hasActiveFilters =
    searchParams.get("search") || (view && view !== "month");

  // Use real data from API for today's appointments
  const { data: todayAppointmentsData, isLoading: isLoadingToday } =
    useTodayAppointments();

  const getAppointmentColor = (type: string) => {
    switch (type) {
      case "personal-care":
        return "bg-blue-500";
      case "community":
        return "bg-green-500";
      case "home-mod":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      {/* Calendar Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex-1 max-w-md">
            <SearchInput placeholder="Search appointments..." />
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              Today
            </Button>
            <Button variant="outline" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <span className="font-semibold text-lg">
              {date ? format(date, "MMMM yyyy") : "Select date"}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Select value={view} onValueChange={handleViewChange}>
            <SelectTrigger className="w-32">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="outline" onClick={handleClearFilters} size="sm">
              <XIcon className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}

          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today&apos;s Appointments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoadingToday ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="p-3 border rounded-lg animate-pulse"
                    >
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-3 bg-muted rounded mb-1"></div>
                      <div className="h-3 bg-muted rounded"></div>
                    </div>
                  ))}
                </div>
              ) : todayAppointmentsData?.appointments.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  <p>No appointments scheduled for today</p>
                </div>
              ) : (
                todayAppointmentsData?.appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-3 h-3 rounded-full ${getAppointmentColor(
                            appointment.serviceType
                              .toLowerCase()
                              .replace(/\s+/g, "-")
                          )}`}
                        />
                        <h4 className="font-medium text-sm">
                          {appointment.serviceType}
                        </h4>
                      </div>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(appointment.status)}
                      >
                        {appointment.status}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{appointment.participant.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {appointment.startTime} - {appointment.endTime}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{appointment.staff?.name || "Unassigned"}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
