"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  Plus,
  Calendar,
  MapPin,
  Clock,
  Users,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Filter,
  RefreshCw,
  Loader2,
} from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface AvailableShift {
  id: string;
  shiftDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  serviceType: string;
  location: string;
  requiredRole: string | null;
  requiredSkills: string[];
  isAssigned: boolean;
  assignedTo: string | null;
  notes: string | null;
  participant: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
  requests: Array<{
    id: string;
    status: string;
    message: string | null;
    createdAt: string;
    staff: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  }>;
  pendingRequests: number;
}

interface AvailableShiftsData {
  shifts: AvailableShift[];
  total: number;
  page: number;
  totalPages: number;
  pendingRequestsCount: number;
}

const SERVICE_TYPES = [
  "Personal Care Support",
  "Community Access",
  "In-Home Support",
  "Respite Care",
  "Skill Development",
  "Nursing Care",
  "Therapy Assistance",
];

const ROLE_OPTIONS = [
  { value: "any", label: "Any Role" },
  { value: "SUPPORT_WORKER", label: "Support Worker" },
  { value: "ENROLLED_NURSE", label: "Enrolled Nurse" },
  { value: "REGISTERED_NURSE", label: "Registered Nurse" },
  { value: "COORDINATOR", label: "Coordinator" },
];

const ROLE_LABELS: Record<string, string> = {
  SUPPORT_WORKER: "Support Worker",
  ENROLLED_NURSE: "Enrolled Nurse",
  REGISTERED_NURSE: "Registered Nurse",
  COORDINATOR: "Coordinator",
};

export function AvailableShiftsContent() {
  const [statusFilter, setStatusFilter] = useState<string>("unassigned");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    shiftDate: "",
    startTime: "09:00",
    endTime: "17:00",
    serviceType: SERVICE_TYPES[0],
    location: "",
    requiredRole: "any",
    notes: "",
  });

  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<AvailableShiftsData>({
    queryKey: ["admin", "available-shifts", statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      const response = await fetch(`/api/admin/available-shifts?${params}`);
      if (!response.ok) throw new Error("Failed to fetch available shifts");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // Convert "any" to null for API
      const payload = {
        ...data,
        requiredRole: data.requiredRole === "any" ? null : data.requiredRole,
      };
      const response = await fetch("/api/admin/available-shifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create shift");
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast.success(
        `Shift created! ${data.notifiedStaff} staff members notified.`
      );
      queryClient.invalidateQueries({
        queryKey: ["admin", "available-shifts"],
      });
      setIsCreateDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (shiftId: string) => {
      const response = await fetch(
        `/api/admin/available-shifts?id=${shiftId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete shift");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("Shift deleted");
      queryClient.invalidateQueries({
        queryKey: ["admin", "available-shifts"],
      });
      setDeleteConfirmId(null);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const resetForm = () => {
    setFormData({
      shiftDate: "",
      startTime: "09:00",
      endTime: "17:00",
      serviceType: SERVICE_TYPES[0],
      location: "",
      requiredRole: "any",
      notes: "",
    });
  };

  const handleCreateShift = () => {
    if (!formData.shiftDate || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }
    createMutation.mutate(formData);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  // Calculate stats
  const totalShifts = data?.total || 0;
  const unassignedShifts =
    data?.shifts.filter((s) => !s.isAssigned).length || 0;
  const assignedShifts = data?.shifts.filter((s) => s.isAssigned).length || 0;

  return (
    <div className="space-y-6 xs:space-y-7 sm:space-y-8 w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
            Available Shifts
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Create and manage shifts for staff to pick up
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button
            size="sm"
            className="gap-2"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add Shift
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalShifts}</div>
          </CardContent>
        </Card>
        <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-600" />
              Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {unassignedShifts}
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
              Assigned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {assignedShifts}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests Alert */}
      {data?.pendingRequestsCount && data.pendingRequestsCount > 0 && (
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <span className="font-medium text-amber-800 dark:text-amber-200">
                {data.pendingRequestsCount} pending shift request
                {data.pendingRequestsCount > 1 ? "s" : ""} awaiting review
              </span>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto"
                onClick={() => (window.location.href = "/admin/shift-requests")}
              >
                Review Requests
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Shifts</SelectItem>
              <SelectItem value="unassigned">Available</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Shifts List */}
      <Card className="border-border/50 shadow-soft-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Shifts ({data?.total || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 border rounded-xl"
                >
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">
                Failed to load shifts
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {error instanceof Error ? error.message : "An error occurred"}
              </p>
              <Button onClick={() => refetch()}>Try Again</Button>
            </div>
          ) : !data?.shifts.length ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">No shifts found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first available shift for staff to pick up
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Shift
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {data.shifts.map((shift, index) => (
                  <motion.div
                    key={shift.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex flex-col md:flex-row md:items-center gap-4 p-4 border rounded-xl hover:bg-muted/30 transition-colors"
                  >
                    {/* Date Badge */}
                    <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 shrink-0">
                      <div className="text-center">
                        <div className="text-xs font-medium text-primary uppercase">
                          {format(new Date(shift.shiftDate), "MMM")}
                        </div>
                        <div className="text-2xl font-bold">
                          {format(new Date(shift.shiftDate), "d")}
                        </div>
                      </div>
                    </div>

                    {/* Shift Details */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold">{shift.serviceType}</h4>
                        {shift.requiredRole && (
                          <Badge variant="outline" className="text-xs">
                            {ROLE_LABELS[shift.requiredRole] ||
                              shift.requiredRole}
                          </Badge>
                        )}
                        {shift.isAssigned ? (
                          <Badge variant="success" className="text-xs">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Assigned
                          </Badge>
                        ) : (
                          <Badge variant="info" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            Available
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {shift.startTime} - {shift.endTime} (
                          {formatDuration(shift.duration)})
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {shift.location}
                        </span>
                      </div>
                      {shift.participant && (
                        <p className="text-sm text-muted-foreground">
                          Participant: {shift.participant.firstName}{" "}
                          {shift.participant.lastName}
                        </p>
                      )}
                    </div>

                    {/* Requests & Actions */}
                    <div className="flex items-center gap-3 shrink-0">
                      {shift.pendingRequests > 0 && (
                        <Badge variant="warning">
                          <Users className="h-3 w-3 mr-1" />
                          {shift.pendingRequests} request
                          {shift.pendingRequests > 1 ? "s" : ""}
                        </Badge>
                      )}

                      {!shift.isAssigned && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setDeleteConfirmId(shift.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Shift Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Available Shift</DialogTitle>
            <DialogDescription>
              Add a new shift for staff members to pick up. All eligible staff
              will be notified.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shiftDate">Date *</Label>
              <Input
                id="shiftDate"
                type="date"
                value={formData.shiftDate}
                onChange={(e) =>
                  setFormData({ ...formData, shiftDate: e.target.value })
                }
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceType">Service Type</Label>
              <Select
                value={formData.serviceType}
                onValueChange={(value) =>
                  setFormData({ ...formData, serviceType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Enter shift location"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="requiredRole">Required Role (Optional)</Label>
              <Select
                value={formData.requiredRole}
                onValueChange={(value) =>
                  setFormData({ ...formData, requiredRole: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any role can apply" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Any additional information..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateShift}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Shift
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteConfirmId}
        onOpenChange={() => setDeleteConfirmId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Shift</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this shift? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deleteConfirmId && deleteMutation.mutate(deleteConfirmId)
              }
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Shift"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
