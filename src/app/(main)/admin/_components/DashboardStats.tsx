"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, MessageSquare, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardStatsProps {
  stats: {
    totalApplications: number;
    totalMessages: number;
    pendingReviews: number;
    activeStaffMembers: number;
  };
}

const statsConfig = [
  {
    title: "Total Applications",
    key: "totalApplications" as const,
    icon: Briefcase,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Contact Messages",
    key: "totalMessages" as const,
    icon: MessageSquare,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Pending Reviews",
    key: "pendingReviews" as const,
    icon: Clock,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  {
    title: "Active Staff Members",
    key: "activeStaffMembers" as const,
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
];

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statsConfig.map((stat, index) => {
        const Icon = stat.icon;
        const value = stats[stat.key];

        return (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-full p-2 ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">
                  +20% from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
