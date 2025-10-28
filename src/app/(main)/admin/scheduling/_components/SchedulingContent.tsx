"use client";

import { useState } from "react";
import { useStaffShifts } from "@/lib/queries/admin-queries";
import { SimpleCalendar } from "./SimpleCalendar";
import { ShiftModal } from "./ShiftModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Users, Clock } from "lucide-react";

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

export function SchedulingContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [editingShift, setEditingShift] = useState<Shift>();

  // Fetch staff shifts data
  const { data, error } = useStaffShifts();

  const handleAddShift = (date: Date) => {
    setEditingShift(undefined);
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleEditShift = (shift: Shift) => {
    setEditingShift(shift);
    setSelectedDate(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(undefined);
    setEditingShift(undefined);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
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
  const stats = data?.stats;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Staff Scheduling</h1>
          <p className="text-muted-foreground">
            Manage staff shifts and schedules
          </p>
        </div>
        <Button onClick={() => handleAddShift(new Date())}>
          <Plus className="h-4 w-4 mr-2" />
          Add Shift
        </Button>
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Shifts
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalShifts}</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.scheduledShifts}</div>
              <p className="text-xs text-muted-foreground">Active shifts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedShifts}</div>
              <p className="text-xs text-muted-foreground">Finished shifts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
              <Badge variant="secondary" className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.cancelledShifts}</div>
              <p className="text-xs text-muted-foreground">Cancelled shifts</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Calendar */}
      <SimpleCalendar
        shifts={shifts}
        onAddShift={handleAddShift}
        onEditShift={handleEditShift}
      />

      {/* Shift Modal */}
      <ShiftModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialDate={selectedDate}
        editShift={editingShift}
      />
    </div>
  );
}
