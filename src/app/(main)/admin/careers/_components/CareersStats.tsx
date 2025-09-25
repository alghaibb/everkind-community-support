"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, TrendingUp, Calendar, Users } from "lucide-react";
import { ROLE_ICONS, ROLE_COLORS } from "../../constants";

interface CareersStatsProps {
  stats: {
    total: number;
    thisWeek: number;
    thisMonth: number;
    byRole: Array<{
      role: string;
      _count: { role: number };
    }>;
  };
}

export default function CareersStats({ stats }: CareersStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Applications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Applications
          </CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">All time</p>
        </CardContent>
      </Card>

      {/* This Week */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Week</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.thisWeek}</div>
          <p className="text-xs text-muted-foreground">New applications</p>
        </CardContent>
      </Card>

      {/* This Month */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.thisMonth}</div>
          <p className="text-xs text-muted-foreground">Monthly total</p>
        </CardContent>
      </Card>

      {/* Role Breakdown */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">By Role</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.byRole.map((roleData) => {
              const Icon =
                ROLE_ICONS[roleData.role as keyof typeof ROLE_ICONS] || Users;
              const colorClass =
                ROLE_COLORS[roleData.role as keyof typeof ROLE_COLORS] ||
                "bg-gray-100 text-gray-800";

              return (
                <div
                  key={roleData.role}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-3 w-3" />
                    <span className="text-xs">{roleData.role}</span>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${colorClass}`}
                  >
                    {roleData._count.role}
                  </Badge>
                </div>
              );
            })}
            {stats.byRole.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No applications yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
