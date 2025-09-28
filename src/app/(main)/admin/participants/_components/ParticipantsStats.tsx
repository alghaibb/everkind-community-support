import { Users, UserCheck, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Participant } from "@/types/admin";
import { ParticipantStatus } from "@/generated/prisma";

interface ParticipantsStatsProps {
  participants: Participant[];
}

export default function ParticipantsStats({
  participants,
}: ParticipantsStatsProps) {
  // Calculate stats
  const totalParticipants = participants.length;
  const activeParticipants = participants.filter(
    (p) => p.status === "ACTIVE" as ParticipantStatus
  ).length;
  const pendingParticipants = participants.filter(
    (p) => p.status === "PENDING" as ParticipantStatus
  ).length;
  const inactiveParticipants = participants.filter(
    (p) => p.status === "INACTIVE" || p.status === "DISCHARGED" as ParticipantStatus
  ).length;

  const stats = [
    {
      title: "Total Participants",
      value: totalParticipants,
      icon: Users,
      description: "All registered participants",
    },
    {
      title: "Active Participants",
      value: activeParticipants,
      icon: UserCheck,
      description: "Currently receiving support",
    },
    {
      title: "Pending Participants",
      value: pendingParticipants,
      icon: Clock,
      description: "Awaiting plan approval",
    },
    {
      title: "Inactive Participants",
      value: inactiveParticipants,
      icon: AlertCircle,
      description: "Not currently active",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
