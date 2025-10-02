"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
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
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  addMonths,
  subMonths,
  isToday,
} from "date-fns";
import {
  useTodayAppointments,
  AppointmentData,
} from "@/lib/queries/admin-queries";

export function SchedulingCalendar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

  // Generate calendar days for the current month
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  const appointmentsByDate = useMemo(() => {
    const appointments: Record<string, AppointmentData[]> = {};

    // Add today's appointments
    if (todayAppointmentsData?.appointments) {
      const today = format(new Date(), "yyyy-MM-dd");
      appointments[today] = todayAppointmentsData.appointments;
    }

    const today = new Date();
    for (let i = -10; i <= 10; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateKey = format(date, "yyyy-MM-dd");

      if (!appointments[dateKey]) {
        // Create mock appointments for demo
        appointments[dateKey] =
          todayAppointmentsData?.appointments?.slice(
            0,
            Math.floor(Math.random() * 3)
          ) || [];
      }
    }

    return appointments;
  }, [todayAppointmentsData]);

  const handleDayClick = (day: Date) => {
    // Navigate to appointments tab with date filter
    const dateString = format(day, "yyyy-MM-dd");
    router.push(`/admin/scheduling?tab=appointments&date=${dateString}`, {
      scroll: false,
    });
  };

  const handleAddAppointment = (day: Date, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering day click
    const dateString = format(day, "yyyy-MM-dd");
    router.push(
      `/admin/scheduling?tab=appointments&date=${dateString}&action=new`,
      { scroll: false }
    );
  };

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  const handleToday = () => {
    setCurrentMonth(new Date());
  };

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
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
          <div className="flex-1 max-w-md">
            <SearchInput placeholder="Search appointments..." />
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2">
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
              Today
            </Button>
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <span className="font-semibold text-sm sm:text-lg whitespace-nowrap">
              {format(currentMonth, "MMM yyyy")}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Select value={view} onValueChange={handleViewChange}>
            <SelectTrigger className="w-24 sm:w-32">
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
            <Button
              variant="outline"
              onClick={handleClearFilters}
              size="sm"
              className="flex-shrink-0"
            >
              <XIcon className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}

          <Button className="flex-1 sm:flex-none">
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Custom Calendar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{format(currentMonth, "MMMM yyyy")}</span>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={handleToday}>
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousMonth}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleNextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Calendar Grid */}
              <div className="calendar-grid">
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="p-2 text-center text-sm font-medium text-muted-foreground"
                      >
                        {day}
                      </div>
                    )
                  )}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => {
                    const dayKey = format(day, "yyyy-MM-dd");
                    const dayAppointments = appointmentsByDate[dayKey] || [];
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isSelectedDay = false; // Will be implemented when date selection is added
                    const isTodayDate = isToday(day);

                    return (
                      <div
                        key={index}
                        className={`
                          min-h-[100px] p-2 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 relative
                          ${isCurrentMonth ? "bg-background" : "bg-muted/20 text-muted-foreground"}
                          ${isSelectedDay ? "ring-2 ring-primary" : ""}
                          ${isTodayDate ? "bg-primary/5 border-primary/20" : ""}
                        `}
                        onClick={() => handleDayClick(day)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`text-sm font-medium ${isTodayDate ? "text-primary" : ""}`}
                          >
                            {format(day, "d")}
                          </span>
                          <div className="flex items-center space-x-1">
                            {dayAppointments.length > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                {dayAppointments.length}
                              </Badge>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 hover:bg-primary/10"
                              onClick={(e) => handleAddAppointment(day, e)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Show up to 2 appointments (reduced to make room for + button) */}
                        <div className="space-y-1">
                          {dayAppointments
                            .slice(0, 2)
                            .map((appointment, idx) => (
                              <div
                                key={appointment.id}
                                className={`text-xs p-1 rounded truncate ${getAppointmentColor(
                                  appointment.serviceType
                                    .toLowerCase()
                                    .replace(/\s+/g, "-")
                                )} text-white`}
                                title={`${appointment.serviceType} - ${appointment.participant.name}`}
                              >
                                {appointment.startTime}{" "}
                                {appointment.participant.name.split(" ")[0]}
                              </div>
                            ))}
                          {dayAppointments.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{dayAppointments.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
