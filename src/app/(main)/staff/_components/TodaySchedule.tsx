"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, User, Calendar } from "lucide-react";
import { SHIFT_STATUS } from "../constants";

interface Shift {
  id: string;
  startTime: string;
  endTime: string;
  serviceType: string;
  location: string;
  status: string;
  participant?: {
    firstName: string;
    lastName: string;
  };
}

interface TodayScheduleProps {
  shifts: Shift[];
}

export function TodaySchedule({ shifts }: TodayScheduleProps) {
  if (shifts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="font-semibold text-lg mb-2">No shifts today</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          You don&apos;t have any shifts scheduled for today. Check your weekly
          schedule or browse available shifts.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {shifts.map((shift) => {
        const statusConfig =
          SHIFT_STATUS[shift.status as keyof typeof SHIFT_STATUS] || SHIFT_STATUS.SCHEDULED;

        return (
          <div
            key={shift.id}
            className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors border border-border/30"
          >
            {/* Time Block */}
            <div className="flex flex-col items-center justify-center min-w-[60px] p-3 rounded-lg bg-primary/10 text-primary">
              <span className="text-xs font-medium">START</span>
              <span className="text-lg font-bold">{shift.startTime}</span>
            </div>

            {/* Shift Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-semibold text-sm sm:text-base truncate">
                    {shift.serviceType}
                  </h4>
                  {shift.participant && (
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground mt-1">
                      <User className="h-3 w-3" />
                      <span>
                        {shift.participant.firstName}{" "}
                        {shift.participant.lastName}
                      </span>
                    </div>
                  )}
                </div>
                <Badge variant={statusConfig.variant}>
                  {statusConfig.label}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>
                    {shift.startTime} - {shift.endTime}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate max-w-[150px]">
                    {shift.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Action */}
            <Button variant="outline" size="sm" className="shrink-0">
              View
            </Button>
          </div>
        );
      })}
    </div>
  );
}
