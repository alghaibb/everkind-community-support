"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  AlertCircle,
  CheckCheck,
} from "lucide-react";
import { useNotifications } from "@/lib/queries/staff-queries";
import { NotificationsSkeleton } from "./NotificationsSkeleton";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

const NOTIFICATION_ICONS = {
  SHIFT_ASSIGNED: Calendar,
  SHIFT_CANCELLED: XCircle,
  SHIFT_REQUEST_APPROVED: CheckCircle2,
  SHIFT_REQUEST_REJECTED: XCircle,
  TIMESHEET_APPROVED: CheckCircle2,
  TIMESHEET_REJECTED: XCircle,
  NEW_PARTICIPANT: User,
  SCHEDULE_CHANGE: Clock,
  GENERAL: Bell,
};

const NOTIFICATION_COLORS = {
  SHIFT_ASSIGNED: "from-blue-500 to-indigo-600",
  SHIFT_CANCELLED: "from-red-500 to-rose-600",
  SHIFT_REQUEST_APPROVED: "from-green-500 to-emerald-600",
  SHIFT_REQUEST_REJECTED: "from-red-500 to-rose-600",
  TIMESHEET_APPROVED: "from-green-500 to-emerald-600",
  TIMESHEET_REJECTED: "from-red-500 to-rose-600",
  NEW_PARTICIPANT: "from-violet-500 to-purple-600",
  SCHEDULE_CHANGE: "from-amber-500 to-orange-600",
  GENERAL: "from-gray-500 to-gray-600",
};

export function NotificationsContent() {
  const { data, isLoading, error, refetch } = useNotifications();

  const markAllAsRead = async () => {
    try {
      await fetch("/api/staff/notifications/mark-all-read", {
        method: "POST",
      });
      refetch();
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
      toast.error("Failed to mark notifications as read");
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/staff/notifications/${id}/read`, {
        method: "POST",
      });
      refetch();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  if (isLoading) {
    return <NotificationsSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Failed to load notifications
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

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  return (
    <div className="space-y-6 xs:space-y-7 sm:space-y-8 w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
            Notifications
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Stay updated with your shift changes and approvals
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            className="gap-2 shrink-0 w-full sm:w-auto"
            onClick={markAllAsRead}
          >
            <CheckCheck className="h-4 w-4" />
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="flex gap-4">
        <Badge variant="info" className="text-sm py-1 px-3">
          {notifications.length} total
        </Badge>
        {unreadCount > 0 && (
          <Badge variant="destructive" className="text-sm py-1 px-3">
            {unreadCount} unread
          </Badge>
        )}
      </div>

      {/* Notifications List */}
      <Card className="border-border/50 shadow-soft-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            All Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">No notifications</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                You&apos;re all caught up! New notifications will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification, index) => {
                const Icon =
                  NOTIFICATION_ICONS[
                    notification.type as keyof typeof NOTIFICATION_ICONS
                  ] || Bell;
                const color =
                  NOTIFICATION_COLORS[
                    notification.type as keyof typeof NOTIFICATION_COLORS
                  ] || NOTIFICATION_COLORS.GENERAL;

                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={`flex items-start gap-4 p-4 rounded-xl border transition-colors cursor-pointer ${
                      notification.isRead
                        ? "bg-muted/20 border-border/30"
                        : "bg-primary/5 border-primary/20 hover:bg-primary/10"
                    }`}
                    onClick={() =>
                      !notification.isRead && markAsRead(notification.id)
                    }
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${color} shadow-lg shrink-0`}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-semibold text-sm">
                            {notification.title}
                            {!notification.isRead && (
                              <Badge
                                variant="info"
                                className="ml-2 text-[10px]"
                              >
                                New
                              </Badge>
                            )}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {formatDistanceToNow(
                            new Date(notification.createdAt),
                            {
                              addSuffix: true,
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
