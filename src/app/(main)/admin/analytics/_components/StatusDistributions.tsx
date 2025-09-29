import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface StatusDistributionsProps {
  distributions: {
    participantsByStatus: { status: string; count: number }[];
    staffByRole: { role: string; count: number }[];
    applicationsByStatus: { status: string; count: number }[];
  };
}

export default function StatusDistributions({
  distributions,
}: StatusDistributionsProps) {
  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      // Participant statuses
      ACTIVE: "bg-green-500",
      INACTIVE: "bg-gray-500",
      PENDING: "bg-yellow-500",
      DISCHARGED: "bg-red-500",

      // Staff roles
      SUPPORT_WORKER: "bg-blue-500",
      SENIOR_SUPPORT_WORKER: "bg-indigo-500",
      TEAM_LEADER: "bg-purple-500",
      COORDINATOR: "bg-pink-500",
      ADMIN: "bg-gray-700",

      // Application statuses
      SUBMITTED: "bg-blue-500",
      UNDER_REVIEW: "bg-yellow-500",
      APPROVED: "bg-green-500",
      REJECTED: "bg-red-500",
    };
    return statusColors[status] || "bg-gray-400";
  };

  const formatLabel = (text: string) => {
    return text
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const renderDistribution = (
    title: string,
    data:
      | { status: string; count: number }[]
      | { role: string; count: number }[],
    keyField: "status" | "role"
  ) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.map((item) => {
            const key =
              keyField === "status"
                ? (item as { status: string }).status
                : (item as { role: string }).role;
            const percentage =
              total > 0 ? Math.round((item.count / total) * 100) : 0;

            return (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${getStatusColor(key)}`}
                    />
                    <span className="text-sm font-medium">
                      {formatLabel(key)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {item.count}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {percentage}%
                    </Badge>
                  </div>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}

          {data.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No data available
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Status Distributions</h2>
      <div className="grid gap-6 lg:grid-cols-3">
        {renderDistribution(
          "Participants by Status",
          distributions.participantsByStatus,
          "status"
        )}

        {renderDistribution("Staff by Role", distributions.staffByRole, "role")}

        {renderDistribution(
          "Applications by Status",
          distributions.applicationsByStatus,
          "status"
        )}
      </div>
    </div>
  );
}
