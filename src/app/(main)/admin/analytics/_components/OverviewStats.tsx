import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  UserCheck,
  Briefcase,
  MessageCircle,
  DollarSign,
  Calculator,
} from "lucide-react";

interface OverviewStatsProps {
  overview: {
    totalParticipants: number;
    totalStaff: number;
    totalCareerApplications: number;
    totalContactMessages: number;
    totalBudgetAllocated: number;
    averageBudgetPerParticipant: number;
  };
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function OverviewStats({ overview }: OverviewStatsProps) {
  const stats = [
    {
      title: "Total Participants",
      value: overview.totalParticipants.toLocaleString(),
      icon: Users,
      description: "Active NDIS participants",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Staff Members",
      value: overview.totalStaff.toLocaleString(),
      icon: UserCheck,
      description: "Active support workers",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Career Applications",
      value: overview.totalCareerApplications.toLocaleString(),
      icon: Briefcase,
      description: "Total applications received",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Contact Messages",
      value: overview.totalContactMessages.toLocaleString(),
      icon: MessageCircle,
      description: "Inquiries and messages",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Total Budget Allocated",
      value: formatCurrency(overview.totalBudgetAllocated),
      icon: DollarSign,
      description: "NDIS funding managed",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Average Budget",
      value: formatCurrency(overview.averageBudgetPerParticipant),
      icon: Calculator,
      description: "Per participant funding",
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Overview</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
