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
    (p) => p.status === ("ACTIVE" as ParticipantStatus)
  ).length;
  const pendingParticipants = participants.filter(
    (p) => p.status === ("PENDING" as ParticipantStatus)
  ).length;
  const inactiveParticipants = participants.filter(
    (p) =>
      p.status === "INACTIVE" ||
      p.status === ("DISCHARGED" as ParticipantStatus)
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
    <div className="grid gap-4 xs:gap-5 sm:gap-6 grid-cols-1 xs:grid-cols-2 xl:grid-cols-4 w-full min-w-0">
      {stats.map((stat, index) => (
        <Card
          key={stat.title}
          className="w-full hover:scale-[1.02] transition-transform duration-300 animate-scale-in"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-xs xs:text-sm font-semibold truncate">
              {stat.title}
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 shrink-0">
              <stat.icon className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl xs:text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
              {stat.value}
            </div>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
