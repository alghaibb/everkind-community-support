"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Clock,
  CheckCircle,
  PlayCircle,
  FileText,
  User,
  X as XIcon,
  Filter,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { useServiceLogs } from "@/lib/queries/admin-queries";

export function ServiceTracking() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);

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

  // Get search from URL params
  const searchTerm = searchParams.get("search") || "";

  const hasActiveFilters =
    searchParams.get("search") || (statusFilter && statusFilter !== "all");

  // Load ALL service logs data once (no filters for initial load)
  const { data: allData, isLoading, error } = useServiceLogs("", "all");

  // Client-side filtering and pagination
  const filteredAndPaginatedData = useMemo(() => {
    if (!allData?.serviceLogs)
      return {
        serviceLogs: [],
        pagination: { page: 1, pageSize: 10, totalPages: 1, total: 0 },
      };

    let filtered = allData.serviceLogs;

    // Apply status filter
    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter((log) => log.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.participant.name.toLowerCase().includes(searchLower) ||
          log.participant.ndisNumber.toLowerCase().includes(searchLower) ||
          log.serviceType.toLowerCase().includes(searchLower) ||
          log.location.toLowerCase().includes(searchLower) ||
          (log.staff.name || "").toLowerCase().includes(searchLower) ||
          (log.description || "").toLowerCase().includes(searchLower) ||
          (log.notes || "").toLowerCase().includes(searchLower)
      );
    }

    // Calculate pagination
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedServiceLogs = filtered.slice(startIndex, endIndex);

    return {
      serviceLogs: paginatedServiceLogs,
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
    serviceLogs: filteredAndPaginatedData.serviceLogs,
    pagination: filteredAndPaginatedData.pagination,
    stats: allData?.stats || {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0,
      totalHours: 0,
      ndisApproved: 0,
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
        <p className="text-destructive">Failed to load service logs</p>
        <p className="text-sm text-muted-foreground mt-2">
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { serviceLogs, stats } = data;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStartService = (logId: string) => {
    // Implement start service logic
    console.log("Starting service:", logId);
  };

  const handleCompleteService = (logId: string) => {
    // Implement complete service logic
    console.log("Completing service:", logId);
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
          <div className="flex-1 max-w-md">
            <SearchInput placeholder="Search service logs..." />
          </div>
          <div className="flex items-center space-x-2">
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-32">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
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
            <FileText className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Dialog open={isLogDialogOpen} onOpenChange={setIsLogDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex-1 sm:flex-none">
                <Clock className="h-4 w-4 mr-2" />
                Log Service
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Log Service Delivery</DialogTitle>
                <DialogDescription>
                  Record details of completed service delivery for NDIS
                  compliance.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="participant" className="text-right">
                    Participant
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select participant" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john-smith">John Smith</SelectItem>
                      <SelectItem value="emma-davis">Emma Davis</SelectItem>
                      <SelectItem value="david-brown">David Brown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="service" className="text-right">
                    Service
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal-care">
                        Personal Care Support
                      </SelectItem>
                      <SelectItem value="community-access">
                        Community Access
                      </SelectItem>
                      <SelectItem value="home-mod">
                        Home Modifications
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="hours" className="text-right">
                    Hours
                  </Label>
                  <Input
                    id="hours"
                    type="number"
                    step="0.5"
                    placeholder="2.0"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="notes" className="text-right pt-2">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Describe the service delivered..."
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={() => setIsLogDialogOpen(false)}>
                  Save Service Log
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Service Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Service Delivery Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Participant</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>NDIS</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {serviceLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="font-medium">{log.participant.name}</div>
                  </TableCell>
                  <TableCell>{log.serviceType}</TableCell>
                  <TableCell>{log.staff.name}</TableCell>
                  <TableCell>{log.serviceDate}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{log.startTime}</div>
                      {log.endTime && (
                        <div className="text-muted-foreground">
                          to {log.endTime}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {log.actualHours ? `${log.actualHours}h` : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={getStatusColor(log.status)}
                    >
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {log.ndisApproved ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {log.status === "pending" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStartService(log.id)}
                        >
                          <PlayCircle className="h-4 w-4" />
                        </Button>
                      )}
                      {log.status === "in-progress" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCompleteService(log.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
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
              Total Services
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total services</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Services delivered</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHours}h</div>
            <p className="text-xs text-muted-foreground">Delivered this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">NDIS Approved</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ndisApproved}</div>
            <p className="text-xs text-muted-foreground">Approved services</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
