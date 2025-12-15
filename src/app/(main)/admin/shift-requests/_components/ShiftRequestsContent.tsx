"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { format, formatDistanceToNow } from "date-fns";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  MapPin,
  User,
  AlertCircle,
  Loader2,
  Filter,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface ShiftRequest {
  id: string;
  status: string;
  message: string | null;
  rejectionNotes: string | null;
  createdAt: string;
  reviewedAt: string | null;
  staff: {
    id: string;
    userId: string;
    name: string;
    email: string;
    image: string | null;
    role: string;
    employeeId: string | null;
  };
  shift: {
    id: string;
    shiftDate: string;
    startTime: string;
    endTime: string;
    duration: number;
    serviceType: string;
    location: string;
    isAssigned: boolean;
    participant: {
      firstName: string;
      lastName: string;
    } | null;
  };
}

interface ShiftRequestsData {
  requests: ShiftRequest[];
  total: number;
  page: number;
  totalPages: number;
  counts: {
    pending: number;
    approved: number;
    rejected: number;
  };
}

const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    variant: "warning" as const,
    icon: Clock,
  },
  APPROVED: {
    label: "Approved",
    variant: "success" as const,
    icon: CheckCircle2,
  },
  REJECTED: {
    label: "Rejected",
    variant: "destructive" as const,
    icon: XCircle,
  },
};

const ROLE_LABELS: Record<string, string> = {
  SUPPORT_WORKER: "Support Worker",
  ENROLLED_NURSE: "Enrolled Nurse",
  REGISTERED_NURSE: "Registered Nurse",
  COORDINATOR: "Coordinator",
};

export function ShiftRequestsContent() {
  const [statusFilter, setStatusFilter] = useState<string>("PENDING");
  const [selectedRequest, setSelectedRequest] = useState<ShiftRequest | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionNotes, setRejectionNotes] = useState("");

  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<ShiftRequestsData>({
    queryKey: ["admin", "shift-requests", statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      const response = await fetch(`/api/admin/shift-requests?${params}`);
      if (!response.ok) throw new Error("Failed to fetch shift requests");
      return response.json();
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const response = await fetch(`/api/admin/shift-requests?id=${requestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to approve request");
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast.success(`Shift approved for ${data.staffName}`);
      queryClient.invalidateQueries({ queryKey: ["admin", "shift-requests"] });
      setSelectedRequest(null);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ requestId, notes }: { requestId: string; notes: string }) => {
      const response = await fetch(`/api/admin/shift-requests?id=${requestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", rejectionNotes: notes }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to reject request");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("Request rejected");
      queryClient.invalidateQueries({ queryKey: ["admin", "shift-requests"] });
      setRejectDialogOpen(false);
      setSelectedRequest(null);
      setRejectionNotes("");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleApprove = (request: ShiftRequest) => {
    approveMutation.mutate(request.id);
  };

  const handleRejectClick = (request: ShiftRequest) => {
    setSelectedRequest(request);
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = () => {
    if (selectedRequest) {
      rejectMutation.mutate({
        requestId: selectedRequest.id,
        notes: rejectionNotes,
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6 xs:space-y-7 sm:space-y-8 w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
            Shift Requests
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Review and approve staff shift pickup requests
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      {data?.counts && (
        <div className="grid gap-4 grid-cols-3">
          <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-600" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{data.counts.pending}</div>
            </CardContent>
          </Card>
          <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Approved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{data.counts.approved}</div>
            </CardContent>
          </Card>
          <Card className="border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                Rejected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{data.counts.rejected}</div>
            </CardContent>
          </Card>
        </div>
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
              <SelectItem value="all">All Requests</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Requests List */}
      <Card className="border-border/50 shadow-soft-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Shift Requests ({data?.total || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-4 p-4 border rounded-xl">
                  <Skeleton className="h-12 w-12 rounded-full" />
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
              <h3 className="font-semibold text-lg mb-2">Failed to load requests</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {error instanceof Error ? error.message : "An error occurred"}
              </p>
              <Button onClick={() => refetch()}>Try Again</Button>
            </div>
          ) : !data?.requests.length ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">No requests found</h3>
              <p className="text-sm text-muted-foreground">
                {statusFilter === "PENDING"
                  ? "All shift requests have been processed"
                  : "No shift requests match your filter"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {data.requests.map((request, index) => {
                  const statusConfig = STATUS_CONFIG[request.status as keyof typeof STATUS_CONFIG];
                  const StatusIcon = statusConfig?.icon || Clock;

                  return (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex flex-col md:flex-row md:items-center gap-4 p-4 border rounded-xl hover:bg-muted/30 transition-colors"
                    >
                      {/* Staff Info */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Avatar className="h-12 w-12 border-2 border-primary/20">
                          <AvatarImage src={request.staff.image || undefined} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold">
                            {getInitials(request.staff.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <h4 className="font-semibold truncate">{request.staff.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {ROLE_LABELS[request.staff.role] || request.staff.role}
                          </p>
                        </div>
                      </div>

                      {/* Shift Details */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="font-medium">
                            {format(new Date(request.shift.shiftDate), "EEE, MMM d, yyyy")}
                          </span>
                          <span className="text-muted-foreground">
                            {request.shift.startTime} - {request.shift.endTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 shrink-0" />
                          <span className="truncate">
                            {request.shift.serviceType} • {request.shift.location}
                          </span>
                        </div>
                        {request.shift.participant && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4 shrink-0" />
                            <span>
                              {request.shift.participant.firstName}{" "}
                              {request.shift.participant.lastName}
                            </span>
                          </div>
                        )}
                        {request.message && (
                          <p className="text-sm text-muted-foreground italic mt-2">
                            &quot;{request.message}&quot;
                          </p>
                        )}
                      </div>

                      {/* Status & Actions */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex flex-col items-end gap-1">
                          <Badge variant={statusConfig?.variant || "secondary"}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig?.label || request.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(request.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>

                        {request.status === "PENDING" && !request.shift.isAssigned && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1 border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700 dark:border-green-800 dark:hover:bg-green-950"
                              onClick={() => handleApprove(request)}
                              disabled={approveMutation.isPending}
                            >
                              {approveMutation.isPending ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <CheckCircle2 className="h-3 w-3" />
                              )}
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:hover:bg-red-950"
                              onClick={() => handleRejectClick(request)}
                              disabled={rejectMutation.isPending}
                            >
                              <XCircle className="h-3 w-3" />
                              Reject
                            </Button>
                          </div>
                        )}

                        {request.shift.isAssigned && request.status === "PENDING" && (
                          <Badge variant="secondary">Shift Taken</Badge>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Shift Request</DialogTitle>
            <DialogDescription>
              {selectedRequest && (
                <>
                  Rejecting request from <strong>{selectedRequest.staff.name}</strong> for the{" "}
                  {selectedRequest.shift.serviceType} shift on{" "}
                  {format(new Date(selectedRequest.shift.shiftDate), "MMMM d, yyyy")}.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rejectionNotes">Reason (Optional)</Label>
              <Textarea
                id="rejectionNotes"
                placeholder="Provide a reason for rejection..."
                value={rejectionNotes}
                onChange={(e) => setRejectionNotes(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectConfirm}
              disabled={rejectMutation.isPending}
            >
              {rejectMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Rejecting...
                </>
              ) : (
                "Reject Request"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
