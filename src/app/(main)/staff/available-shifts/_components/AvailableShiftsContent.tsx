"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarPlus,
  Clock,
  MapPin,
  User,
  AlertCircle,
  Search,
  Filter,
  Send,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useAvailableShifts } from "@/lib/queries/staff-queries";
import { AvailableShiftsSkeleton } from "./AvailableShiftsSkeleton";
import { SERVICE_TYPES } from "../../constants";
import { format } from "date-fns";
import { toast } from "sonner";

export function AvailableShiftsContent() {
  const [serviceType, setServiceType] = useState<string>("all");
  const [requestingId, setRequestingId] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useAvailableShifts(
    1,
    serviceType === "all" ? undefined : serviceType
  );

  const handleRequestShift = async (shiftId: string) => {
    setRequestingId(shiftId);
    try {
      const response = await fetch("/api/staff/shift-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availableShiftId: shiftId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to request shift");
      }

      toast.success("Shift request submitted! Waiting for admin approval.");
      refetch();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to request shift"
      );
    } finally {
      setRequestingId(null);
    }
  };

  if (isLoading) {
    return <AvailableShiftsSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Failed to load available shifts
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

  return (
    <div className="space-y-6 xs:space-y-7 sm:space-y-8 w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
            Available Shifts
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Browse and request shifts that match your availability
          </p>
        </div>
        <Badge variant="info" className="shrink-0">
          {shifts.length} shifts available
        </Badge>
      </div>

      {/* Filters */}
      <Card className="border-border/50 shadow-soft-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search shifts..."
                  className="pl-10"
                  disabled
                />
              </div>
            </div>
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Service Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                {SERVICE_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Shifts Grid */}
      {shifts.length === 0 ? (
        <Card className="border-border/50 shadow-soft-lg">
          <CardContent className="py-16">
            <div className="text-center">
              <CalendarPlus className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-xl mb-2">
                No available shifts
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                There are no shifts available matching your criteria right now.
                Check back later or adjust your filters.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {shifts.map((shift, index) => (
            <motion.div
              key={shift.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full border-border/50 shadow-soft-lg hover:shadow-glow transition-all duration-300 group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
                        <CalendarPlus className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          {format(new Date(shift.shiftDate), "EEEE")}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(shift.shiftDate), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    {shift.hasRequested && (
                      <Badge variant="warning">Requested</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Service Type */}
                  <div>
                    <p className="font-semibold text-lg">{shift.serviceType}</p>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        {shift.startTime} - {shift.endTime} ({shift.duration}{" "}
                        min)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{shift.location}</span>
                    </div>
                    {shift.participant && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>
                          {shift.participant.firstName}{" "}
                          {shift.participant.lastName}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Skills Required */}
                  {shift.requiredSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {shift.requiredSkills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Action Button */}
                  <Button
                    className="w-full mt-2"
                    onClick={() => handleRequestShift(shift.id)}
                    disabled={shift.hasRequested || requestingId === shift.id}
                  >
                    {requestingId === shift.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Requesting...
                      </>
                    ) : shift.hasRequested ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Already Requested
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Request This Shift
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
