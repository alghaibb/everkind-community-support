import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface GrowthMetricsProps {
  growth: {
    participants: { current: number; previous: number; growth: number };
    staff: { current: number; previous: number; growth: number };
    applications: { current: number; previous: number; growth: number };
    messages: { current: number; previous: number; growth: number };
  };
}

export default function GrowthMetrics({ growth }: GrowthMetricsProps) {
  const metrics = [
    {
      title: "New Participants",
      subtitle: "This month",
      current: growth.participants.current,
      previous: growth.participants.previous,
      growth: growth.participants.growth,
    },
    {
      title: "New Staff",
      subtitle: "This month",
      current: growth.staff.current,
      previous: growth.staff.previous,
      growth: growth.staff.growth,
    },
    {
      title: "Applications",
      subtitle: "This month",
      current: growth.applications.current,
      previous: growth.applications.previous,
      growth: growth.applications.growth,
    },
    {
      title: "Messages",
      subtitle: "This month",
      current: growth.messages.current,
      previous: growth.messages.previous,
      growth: growth.messages.growth,
    },
  ];

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return TrendingUp;
    if (growth < 0) return TrendingDown;
    return Minus;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return "text-green-600 bg-green-50";
    if (growth < 0) return "text-red-600 bg-red-50";
    return "text-gray-600 bg-gray-50";
  };

  const getGrowthBadgeVariant = (
    growth: number
  ): "default" | "secondary" | "destructive" => {
    if (growth > 0) return "default";
    if (growth < 0) return "destructive";
    return "secondary";
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Monthly Growth</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const GrowthIcon = getGrowthIcon(metric.growth);
          const growthColor = getGrowthColor(metric.growth);

          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {metric.subtitle}
                  </p>
                </div>
                <div className={`p-1 rounded ${growthColor}`}>
                  <GrowthIcon className="h-3 w-3" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.current}</div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant={getGrowthBadgeVariant(metric.growth)}
                    className="text-xs"
                  >
                    {metric.growth > 0 ? "+" : ""}
                    {metric.growth}%
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    vs last month ({metric.previous})
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
