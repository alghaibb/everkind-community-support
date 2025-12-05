"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  MapPin,
  User,
  Phone,
  AlertCircle,
  Calendar,
  Navigation,
} from "lucide-react";
import { useStaffAppointments } from "@/lib/queries/staff-queries";
import { AppointmentsSkeleton } from "./AppointmentsSkeleton";
import { format, isToday, isTomorrow, isThisWeek } from "date-fns";

export function AppointmentsContent() {
  const [filter, setFilter] = useState<string>("upcoming");
  const { data, isLoading, error } = useStaffAppointments(
    filter === "upcoming" ? undefined : filter
  );

  if (isLoading) {
    return <AppointmentsSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Failed to load appointments
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

  const appointments = data?.appointments || [];

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isThisWeek(date)) return format(date, "EEEE");
    return format(date, "MMM d");
  };

  const statsCards = [
    {
      title: "Today",
      value: data?.todayCount || 0,
      icon: Calendar,
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "This Week",
      value: data?.weekCount || 0,
      icon: Clock,
      color: "from-emerald-500 to-teal-600",
    },
  ];

  return (
    <div className="space-y-6 xs:space-y-7 sm:space-y-8 w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
            Appointments
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            View and manage your upcoming appointments
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="border-border/50 shadow-soft-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color}`}
                  >
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.title}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="SCHEDULED">Scheduled</TabsTrigger>
          <TabsTrigger value="COMPLETED">Completed</TabsTrigger>
          <TabsTrigger value="CANCELLED">Cancelled</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Appointments List */}
      <Card className="border-border/50 shadow-soft-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {filter === "upcoming" ? "Upcoming" : filter} Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">
                No appointments found
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                {filter === "upcoming"
                  ? "You don't have any upcoming appointments scheduled."
                  : `No ${filter.toLowerCase()} appointments found.`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment, index) => {
                const appointmentDate = new Date(appointment.appointmentDate);
                const dateLabel = getDateLabel(appointmentDate);

                return (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex flex-col lg:flex-row lg:items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors border border-border/30"
                  >
                    {/* Date Badge */}
                    <div className="flex items-center gap-3 lg:min-w-[140px]">
                      <div
                        className={`flex flex-col items-center justify-center min-w-[60px] p-3 rounded-lg ${
                          isToday(appointmentDate)
                            ? "bg-primary text-primary-foreground"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        <span className="text-xs font-medium">{dateLabel}</span>
                        <span className="text-xl font-bold">
                          {format(appointmentDate, "d")}
                        </span>
                      </div>
                      <div className="lg:hidden">
                        <p className="font-semibold">
                          {appointment.serviceType}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {appointment.startTime} - {appointment.endTime}
                        </p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="hidden lg:block">
                        <p className="font-semibold">
                          {appointment.serviceType}
                        </p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {appointment.startTime} - {appointment.endTime} (
                            {appointment.duration} min)
                          </span>
                        </div>
                      </div>

                      {/* Participant Info */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {appointment.participant.firstName}{" "}
                            {appointment.participant.lastName}
                          </span>
                        </div>
                        {appointment.participant.phone && (
                          <a
                            href={`tel:${appointment.participant.phone}`}
                            className="flex items-center gap-1 text-primary hover:underline"
                          >
                            <Phone className="h-3 w-3" />
                            <span>{appointment.participant.phone}</span>
                          </a>
                        )}
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate max-w-[200px]">
                            {appointment.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          appointment.status === "COMPLETED"
                            ? "success"
                            : appointment.status === "CANCELLED"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {appointment.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Navigation className="h-4 w-4 mr-1" />
                        Directions
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
