import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, UserCheck, Briefcase, Clock } from "lucide-react";

interface RecentActivityProps {
  activity: {
    participants: Array<{
      id: string;
      firstName: string;
      lastName: string;
      createdAt: string;
      status: string;
    }>;
    staff: Array<{
      id: string;
      staffRole: string;
      createdAt: string;
      user: { name: string };
    }>;
    applications: Array<{
      id: string;
      firstName: string;
      lastName: string;
      role: string;
      createdAt: string;
      status: string;
    }>;
  };
}

export default function RecentActivity({ activity }: RecentActivityProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  const formatLabel = (text: string) => {
    return text
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: "bg-green-100 text-green-800",
      PENDING: "bg-yellow-100 text-yellow-800",
      SUBMITTED: "bg-blue-100 text-blue-800",
      UNDER_REVIEW: "bg-purple-100 text-purple-800",
      APPROVED: "bg-green-100 text-green-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const renderActivitySection = (
    title: string,
    icon: React.ElementType,
    items: any[],
    renderItem: (item: any) => React.ReactNode
  ) => {
    const Icon = icon;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Icon className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.slice(0, 5).map(renderItem)}

            {items.length === 0 && (
              <div className="text-center py-6 text-muted-foreground text-sm">
                No recent activity
              </div>
            )}

            {items.length > 5 && (
              <div className="text-center pt-2 border-t">
                <Badge variant="outline" className="text-xs">
                  +{items.length - 5} more this month
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Recent Activity</h2>
      <div className="grid gap-6 lg:grid-cols-3">
        {renderActivitySection(
          "New Participants",
          Users,
          activity.participants,
          (participant, index) => (
            <div
              key={`participant-${index}`}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {getInitials(
                      `${participant.firstName} ${participant.lastName}`
                    )}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {participant.firstName} {participant.lastName}
                  </p>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {formatDate(participant.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              <Badge
                variant="outline"
                className={`text-xs ${getStatusColor(participant.status)}`}
              >
                {formatLabel(participant.status)}
              </Badge>
            </div>
          )
        )}

        {renderActivitySection(
          "New Staff",
          UserCheck,
          activity.staff,
          (staff, index) => (
            <div
              key={`staff-${index}`}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {getInitials(staff.user.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{staff.user.name}</p>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {formatDate(staff.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                {formatLabel(staff.staffRole)}
              </Badge>
            </div>
          )
        )}

        {renderActivitySection(
          "Applications",
          Briefcase,
          activity.applications,
          (application, index) => (
            <div
              key={`application-${index}`}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {getInitials(
                      `${application.firstName} ${application.lastName}`
                    )}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {application.firstName} {application.lastName}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {formatLabel(application.role)}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(application.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              <Badge
                variant="outline"
                className={`text-xs ${getStatusColor(application.status)}`}
              >
                {formatLabel(application.status)}
              </Badge>
            </div>
          )
        )}
      </div>
    </div>
  );
}
