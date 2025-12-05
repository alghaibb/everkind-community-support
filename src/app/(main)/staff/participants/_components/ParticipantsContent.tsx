"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users,
  Phone,
  Mail,
  MessageSquare,
  AlertCircle,
  Star,
  Info,
} from "lucide-react";
import { useStaffParticipants } from "@/lib/queries/staff-queries";
import { ParticipantsSkeleton } from "./ParticipantsSkeleton";

export function ParticipantsContent() {
  const { data, isLoading, error } = useStaffParticipants();

  if (isLoading) {
    return <ParticipantsSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Failed to load participants
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

  const participants = data?.participants || [];

  return (
    <div className="space-y-6 xs:space-y-7 sm:space-y-8 w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
            My Participants
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Participants currently assigned to you
          </p>
        </div>
        <Badge variant="info" className="shrink-0">
          {participants.length} assigned
        </Badge>
      </div>

      {/* Participants Grid */}
      {participants.length === 0 ? (
        <Card className="border-border/50 shadow-soft-lg">
          <CardContent className="py-16">
            <div className="text-center">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-xl mb-2">
                No participants assigned
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                You don&apos;t have any participants assigned to you yet.
                Contact your coordinator for assignments.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {participants.map((participant, index) => {
            const initials =
              `${participant.firstName[0]}${participant.lastName[0]}`.toUpperCase();

            return (
              <motion.div
                key={participant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full border-border/50 shadow-soft-lg hover:shadow-glow transition-all duration-300 group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-14 w-14 rounded-xl border-2 border-primary/20">
                        <AvatarFallback className="rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white font-bold text-lg">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <CardTitle className="text-lg">
                              {participant.preferredName ||
                                participant.firstName}{" "}
                              {participant.lastName}
                            </CardTitle>
                            {participant.preferredName && (
                              <p className="text-sm text-muted-foreground">
                                ({participant.firstName} {participant.lastName})
                              </p>
                            )}
                          </div>
                          {participant.isPrimary && (
                            <Badge variant="success" className="shrink-0">
                              <Star className="h-3 w-3 mr-1" />
                              Primary
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Support Needs */}
                    {participant.supportNeeds.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          Support Needs
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {participant.supportNeeds.slice(0, 3).map((need) => (
                            <Badge
                              key={need}
                              variant="secondary"
                              className="text-xs"
                            >
                              {need}
                            </Badge>
                          ))}
                          {participant.supportNeeds.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{participant.supportNeeds.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Communication Method */}
                    {participant.communicationMethod && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                        <span>{participant.communicationMethod}</span>
                      </div>
                    )}

                    {/* Contact Info */}
                    <div className="space-y-2">
                      {participant.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={`tel:${participant.phone}`}
                            className="text-primary hover:underline"
                          >
                            {participant.phone}
                          </a>
                        </div>
                      )}
                      {participant.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={`mailto:${participant.email}`}
                            className="text-primary hover:underline truncate"
                          >
                            {participant.email}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <Button variant="outline" className="w-full mt-2">
                      <Info className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
