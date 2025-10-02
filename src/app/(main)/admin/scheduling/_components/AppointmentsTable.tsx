"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  MoreHorizontal,
  Edit,
  Eye,
  X,
  Calendar,
  Clock,
  MapPin,
  User,
  X as XIcon,
  Filter,
} from "lucide-react";
import { useAppointments } from "@/lib/queries/admin-queries";

export function AppointmentsTable() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const statusFilter = searchParams.get("status") || "all";

  const handleStatusChange = (newStatus: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newStatus && newStatus !== "all") {
      params.set("status", newStatus);
    } else {
      params.delete("status");
    }

    // Reset to page 1 when filtering
    params.set("page", "1");

    router.push(`/admin/scheduling?${params.toString()}`, { scroll: false });
  };

  const handleClearFilters = () => {
    router.push("/admin/scheduling", { scroll: false });
  };

  const hasActiveFilters =
    searchParams.get("search") || (statusFilter && statusFilter !== "all");

  // Get search from URL params
  const searchTerm = searchParams.get("search") || "";

  // Load ALL appointments data once (no filters for initial load)
  const { data: allData, isLoading, error } = useAppointments("", "all");

  // Client-side filtering and pagination
  const filteredAndPaginatedData = useMemo(() => {
    if (!allData?.appointments)
      return {
        appointments: [],
        pagination: { page: 1, pageSize: 10, totalPages: 1, total: 0 },
      };

    let filtered = allData.appointments;

    // Apply status filter
    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter(
        (appointment) => appointment.status === statusFilter
      );
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (appointment) =>
          appointment.participant.name.toLowerCase().includes(searchLower) ||
          appointment.participant.ndisNumber
            .toLowerCase()
            .includes(searchLower) ||
          appointment.serviceType.toLowerCase().includes(searchLower) ||
          appointment.location.toLowerCase().includes(searchLower) ||
          (appointment.staff?.name || "").toLowerCase().includes(searchLower) ||
          (appointment.notes || "").toLowerCase().includes(searchLower)
      );
    }

    // Calculate pagination
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedAppointments = filtered.slice(startIndex, endIndex);

    return {
      appointments: paginatedAppointments,
      pagination: {
        page,
        pageSize,
        totalPages: Math.ceil(filtered.length / pageSize),
        total: filtered.length,
      },
    };
  }, [allData, statusFilter, searchTerm, searchParams]);

  // Use filtered data
  const data = {
    ...allData,
    appointments: filteredAndPaginatedData.appointments,
    pagination: filteredAndPaginatedData.pagination,
    stats: allData?.stats || {
      total: 0,
      confirmed: 0,
      pending: 0,
      cancelled: 0,
      completed: 0,
      totalHours: 0,
    },
  };

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
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load appointments</p>
        <p className="text-sm text-muted-foreground mt-2">
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { appointments, stats } = data;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getServiceColor = (type: string) => {
    switch (type) {
      case "personal-care":
        return "bg-blue-500";
      case "community":
        return "bg-green-500";
      case "home-mod":
        return "bg-purple-500";
      case "daily-living":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
          <div className="flex-1 max-w-md">
            <SearchInput placeholder="Search appointments..." />
          </div>
          <div className="flex items-center space-x-2">
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-32">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={handleClearFilters}
                size="sm"
                className="whitespace-nowrap"
              >
                <XIcon className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Calendar className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="flex-1 sm:flex-none">
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Participant Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Participant</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-3 h-3 rounded-full ${getServiceColor(
                            appointment.serviceType
                              .toLowerCase()
                              .replace(/\s+/g, "-")
                          )}`}
                        />
                        <span className="font-medium">
                          {appointment.participant.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{appointment.serviceType}</TableCell>
                    <TableCell>
                      {appointment.staff?.name || "Unassigned"}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">
                          {appointment.appointmentDate}
                        </div>
                        <div className="text-muted-foreground">
                          {appointment.startTime} - {appointment.endTime}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{appointment.duration}min</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(appointment.status)}
                      >
                        {appointment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{appointment.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Appointment
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <X className="h-4 w-4 mr-2" />
                            Cancel Appointment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Appointments
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total appointments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.confirmed}</div>
            <p className="text-xs text-muted-foreground">Ready to deliver</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHours}h</div>
            <p className="text-xs text-muted-foreground">Scheduled this week</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
