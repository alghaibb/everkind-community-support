"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Edit,
  Clock,
  Calendar,
  User,
  CheckCircle,
  Filter,
  X as XIcon,
} from "lucide-react";
import { useStaffShifts } from "@/lib/queries/admin-queries";

export function StaffRoster() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedWeek = searchParams.get("week") || "current";
  const searchTerm = searchParams.get("search") || "";

  const handleWeekChange = (newWeek: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newWeek && newWeek !== "current") {
      params.set("week", newWeek);
    } else {
      params.delete("week");
    }

    router.push(`/admin/scheduling?${params.toString()}`, { scroll: false });
  };

  const handleClearFilters = () => {
    router.push("/admin/scheduling", { scroll: false });
  };

  const hasActiveFilters =
    searchParams.get("search") || (selectedWeek && selectedWeek !== "current");

  // Use real data from API
  const { data, isLoading, error } = useStaffShifts(searchTerm, selectedWeek);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="h-9 bg-muted animate-pulse rounded" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-9 w-32 bg-muted animate-pulse rounded" />
          </div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load staff shifts</p>
        <p className="text-sm text-muted-foreground mt-2">
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { staffShifts, stats } = data;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-green-100 text-green-800";
      case "off":
        return "bg-gray-100 text-gray-800";
      case "leave":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex-1 max-w-md">
            <SearchInput placeholder="Search staff..." />
          </div>
          <Select value={selectedWeek} onValueChange={handleWeekChange}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="previous">Previous Week</SelectItem>
              <SelectItem value="current">This Week</SelectItem>
              <SelectItem value="next">Next Week</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="flex-shrink-0"
            >
              <XIcon className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}

          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Bulk Edit
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Clock className="h-4 w-4 mr-2" />
            Time Off Requests
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Shift
          </Button>
        </div>
      </div>

      {/* Roster Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Staff Roster -{" "}
            {selectedWeek === "current"
              ? "This Week"
              : selectedWeek === "previous"
                ? "Last Week"
                : "Next Week"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Mon</TableHead>
                <TableHead>Tue</TableHead>
                <TableHead>Wed</TableHead>
                <TableHead>Thu</TableHead>
                <TableHead>Fri</TableHead>
                <TableHead>Sat</TableHead>
                <TableHead>Sun</TableHead>
                <TableHead>Total Hours</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffShifts.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {getInitials(staff.staffName)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{staff.staffName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{staff.role}</TableCell>
                  {staff.shifts.map((shift, index) => (
                    <TableCell key={index}>
                      {shift.startTime && shift.endTime ? (
                        <div className="text-xs">
                          <div>
                            {shift.startTime} - {shift.endTime}
                          </div>
                          <Badge
                            variant="secondary"
                            className={getStatusColor(shift.status)}
                          >
                            {shift.status}
                          </Badge>
                        </div>
                      ) : (
                        <Badge
                          variant="secondary"
                          className={getStatusColor(shift.status)}
                        >
                          {shift.status === "leave" ? "Leave" : "Off"}
                        </Badge>
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <span className="font-medium">{staff.totalHours}h</span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Staff Hours
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHours}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Staff Coverage
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStaff}</div>
            <p className="text-xs text-muted-foreground">Active staff</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Leave Requests
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.scheduledShifts}</div>
            <p className="text-xs text-muted-foreground">Scheduled shifts</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
