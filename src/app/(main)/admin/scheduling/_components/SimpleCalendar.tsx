"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchInput } from "@/components/ui/search-input";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Plus,
  Clock,
  Users,
  AlertTriangle,
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
  parseISO,
  isBefore,
  addHours,
} from "date-fns";

interface Shift {
  id: string;
  shiftDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: string;
  notes?: string;
  staff: {
    id: string;
    user: {
      name: string;
    };
    staffRole: string;
    employeeId?: string;
  };
}

interface SimpleCalendarProps {
  shifts: Shift[];
  onAddShift?: (date: Date) => void;
  onEditShift?: (shift: Shift) => void;
}

export function SimpleCalendar({
  shifts,
  onAddShift,
  onEditShift,
}: SimpleCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");

  // Filter shifts based on search term
  const filteredShifts = useMemo(() => {
    if (!searchTerm) return shifts;

    return shifts.filter(
      (shift) =>
        shift.staff.user.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        shift.staff.employeeId
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        shift.notes?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [shifts, searchTerm]);

  // Group shifts by date and detect conflicts
  const shiftsByDate = useMemo(() => {
    return filteredShifts.reduce(
      (acc, shift) => {
        // Format date as YYYY-MM-DD for consistent grouping
        const dateKey = format(new Date(shift.shiftDate), "yyyy-MM-dd");
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(shift);
        return acc;
      },
      {} as Record<string, Shift[]>
    );
  }, [filteredShifts]);

  // Detect shift conflicts (overlapping times for same staff)
  const conflictsByDate = useMemo(() => {
    const conflicts: Record<
      string,
      { shiftId: string; staffId: string; conflicts: string[] }[]
    > = {};

    Object.entries(shiftsByDate).forEach(([dateKey, dayShifts]) => {
      const shiftConflicts: {
        shiftId: string;
        staffId: string;
        conflicts: string[];
      }[] = [];

      // Group shifts by staff member
      const shiftsByStaff = dayShifts.reduce(
        (acc, shift) => {
          if (!acc[shift.staff.id]) {
            acc[shift.staff.id] = [];
          }
          acc[shift.staff.id].push(shift);
          return acc;
        },
        {} as Record<string, Shift[]>
      );

      // Check for conflicts within each staff member's shifts
      Object.values(shiftsByStaff).forEach((staffShifts) => {
        if (staffShifts.length <= 1) return;

        staffShifts.forEach((shift, index) => {
          const shiftStart = parseISO(`${shift.shiftDate}T${shift.startTime}`);
          const shiftEnd = parseISO(`${shift.shiftDate}T${shift.endTime}`);

          // Handle overnight shifts (end time is next day)
          const actualEnd =
            shiftEnd < shiftStart ? addHours(shiftEnd, 24) : shiftEnd;

          const conflictingShifts: string[] = [];

          staffShifts.forEach((otherShift, otherIndex) => {
            if (index === otherIndex) return;

            const otherStart = parseISO(
              `${otherShift.shiftDate}T${otherShift.startTime}`
            );
            const otherEnd = parseISO(
              `${otherShift.shiftDate}T${otherShift.endTime}`
            );
            const actualOtherEnd =
              otherEnd < otherStart ? addHours(otherEnd, 24) : otherEnd;

            // Check for time overlap
            if (shiftStart < actualOtherEnd && actualEnd > otherStart) {
              conflictingShifts.push(otherShift.id);
            }
          });

          if (conflictingShifts.length > 0) {
            shiftConflicts.push({
              shiftId: shift.id,
              staffId: shift.staff.id,
              conflicts: conflictingShifts,
            });
          }
        });
      });

      if (shiftConflicts.length > 0) {
        conflicts[dateKey] = shiftConflicts;
      }
    });

    return conflicts;
  }, [shiftsByDate]);

  // Calculate coverage stats
  const coverageStats = useMemo(() => {
    const totalShifts = filteredShifts.length;
    const scheduledShifts = filteredShifts.filter(
      (s) => s.status === "SCHEDULED"
    ).length;
    const completedShifts = filteredShifts.filter(
      (s) => s.status === "COMPLETED"
    ).length;
    const conflictedShifts = Object.values(conflictsByDate).reduce(
      (sum, dayConflicts) => sum + dayConflicts.length,
      0
    );

    return {
      total: totalShifts,
      scheduled: scheduledShifts,
      completed: completedShifts,
      conflicts: conflictedShifts,
    };
  }, [filteredShifts, conflictsByDate]);

  // Generate calendar days
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDayClick = (day: Date) => {
    if (onAddShift) {
      onAddShift(day);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "no_show":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Staff Schedule - {format(currentMonth, "MMMM yyyy")}
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="w-64">
              <SearchInput
                placeholder="Search staff or notes..."
                onSearch={setSearchTerm}
                debounceMs={200}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Coverage Stats */}
        <div className="flex items-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="font-medium">{coverageStats.scheduled}</span>
            <span className="text-muted-foreground">scheduled</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-green-500" />
            <span className="font-medium">{coverageStats.total}</span>
            <span className="text-muted-foreground">total shifts</span>
          </div>
          {coverageStats.conflicts > 0 && (
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="font-medium text-red-600">
                {coverageStats.conflicts}
              </span>
              <span className="text-muted-foreground">conflicts</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="p-2 text-center text-sm font-medium text-muted-foreground border-b"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {calendarDays.map((day, index) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const dayShifts =
              (shiftsByDate as Record<string, Shift[]>)[dateKey] || [];
            const dayConflicts = conflictsByDate[dateKey] || [];
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isTodayDate = isToday(day);
            const hasConflicts = dayConflicts.length > 0;

            return (
              <div
                key={index}
                className={`min-h-[100px] p-2 border rounded-lg cursor-pointer transition-colors ${isCurrentMonth ? "bg-background hover:bg-muted/50" : "bg-muted/20 text-muted-foreground"} ${isTodayDate ? "ring-2 ring-primary/20" : ""}`}
                onClick={() => handleDayClick(day)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-sm font-medium ${isTodayDate ? "text-primary" : ""}`}
                  >
                    {format(day, "d")}
                  </span>
                  <div className="flex items-center gap-1">
                    {dayShifts.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {dayShifts.length}
                      </Badge>
                    )}
                    {hasConflicts && (
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                    )}
                  </div>
                </div>

                {/* Show shifts */}
                <div className="space-y-1">
                  {dayShifts.slice(0, 2).map((shift) => {
                    const isConflicted = dayConflicts.some(
                      (conflict) =>
                        conflict.shiftId === shift.id ||
                        conflict.conflicts.includes(shift.id)
                    );

                    return (
                      <div
                        key={shift.id}
                        className={`text-xs p-1 rounded truncate relative ${getStatusColor(shift.status)} ${
                          isConflicted
                            ? "ring-1 ring-red-400 ring-opacity-50"
                            : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onEditShift) {
                            onEditShift(shift);
                          }
                        }}
                        title={`${shift.staff.user.name} - ${shift.startTime} to ${shift.endTime}${
                          isConflicted ? " ⚠️ CONFLICT" : ""
                        }`}
                      >
                        <div className="font-medium">{shift.startTime}</div>
                        <div className="text-xs opacity-90">
                          {shift.staff.user.name.split(" ")[0]}
                        </div>
                        {isConflicted && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                        )}
                      </div>
                    );
                  })}
                  {dayShifts.length > 2 && (
                    <div className="text-xs text-muted-foreground">
                      +{dayShifts.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-100 rounded"></div>
            Scheduled
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-100 rounded"></div>
            Completed
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-100 rounded"></div>
            Cancelled
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
