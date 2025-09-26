"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, Calendar, Award } from "lucide-react";

interface StaffStatsProps {
  stats: {
    total: number;
    active: number;
    thisMonth: number;
    byRole: Array<{
      role: string;
      _count: { staffRole: number };
    }>;
  };
}

export default function StaffStats({ stats }: StaffStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Staff */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">All staff members</p>
        </CardContent>
      </Card>

      {/* Active Staff */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.active}</div>
          <p className="text-xs text-muted-foreground">Currently active</p>
        </CardContent>
      </Card>

      {/* Hired This Month */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.thisMonth}</div>
          <p className="text-xs text-muted-foreground">New hires</p>
        </CardContent>
      </Card>

      {/* Role Breakdown */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">By Role</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.byRole.map((roleData) => {
              const roleName = roleData.role.replace("_", " ");
              return (
                <div
                  key={roleData.role}
                  className="flex items-center justify-between"
                >
                  <span className="text-xs capitalize">{roleName}</span>
                  <Badge
                    variant="secondary"
                    className="text-xs bg-primary/10 text-primary"
                  >
                    {roleData._count.staffRole}
                  </Badge>
                </div>
              );
            })}
            {stats.byRole.length === 0 && (
              <p className="text-xs text-muted-foreground">No staff yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
