"use client";

import { useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import {
  Bell,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  AlertCircle,
  CheckCheck,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { STALE_TIMES } from "@/lib/performance";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationsData {
  notifications: Notification[];
  unreadCount: number;
}

const NOTIFICATION_ICONS: Record<string, typeof Bell> = {
  SHIFT_ASSIGNED: Calendar,
  SHIFT_CANCELLED: XCircle,
  SHIFT_REQUEST_APPROVED: CheckCircle2,
  SHIFT_REQUEST_REJECTED: XCircle,
  TIMESHEET_APPROVED: CheckCircle2,
  TIMESHEET_REJECTED: XCircle,
  NEW_PARTICIPANT: User,
  SCHEDULE_CHANGE: Clock,
  GENERAL: Bell,
  NEW_SHIFT_REQUEST: AlertCircle,
};

const NOTIFICATION_COLORS: Record<string, string> = {
  SHIFT_ASSIGNED: "from-blue-500 to-indigo-600",
  SHIFT_CANCELLED: "from-red-500 to-rose-600",
  SHIFT_REQUEST_APPROVED: "from-green-500 to-emerald-600",
  SHIFT_REQUEST_REJECTED: "from-red-500 to-rose-600",
  TIMESHEET_APPROVED: "from-green-500 to-emerald-600",
  TIMESHEET_REJECTED: "from-red-500 to-rose-600",
  NEW_PARTICIPANT: "from-violet-500 to-purple-600",
  SCHEDULE_CHANGE: "from-amber-500 to-orange-600",
  GENERAL: "from-gray-500 to-gray-600",
  NEW_SHIFT_REQUEST: "from-amber-500 to-orange-600",
};

interface NotificationDropdownProps {
  apiEndpoint?: string;
}

export function NotificationDropdown({
  apiEndpoint = "/api/staff/notifications",
}: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<NotificationsData>({
    queryKey: ["notifications", apiEndpoint],
    queryFn: async () => {
      const response = await fetch(apiEndpoint);
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      return response.json();
    },
    staleTime: STALE_TIMES.REALTIME,
    refetchOnWindowFocus: true,
  });

  const markAsRead = useCallback(
    async (id: string) => {
      try {
        await fetch(`${apiEndpoint}/${id}/read`, {
          method: "POST",
        });
        refetch();
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    },
    [apiEndpoint, refetch]
  );

  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch(`${apiEndpoint}/mark-all-read`, {
        method: "POST",
      });
      if (response.ok) {
        toast.success("All notifications marked as read");
        refetch();
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      toast.error("Failed to mark all as read");
    }
  }, [apiEndpoint, refetch]);

  const handleNotificationClick = useCallback(
    (notification: Notification) => {
      if (!notification.isRead) {
        markAsRead(notification.id);
      }
      if (notification.link) {
        window.location.href = notification.link;
      }
      setIsOpen(false);
    },
    [markAsRead]
  );

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1"
              >
                <Badge
                  variant="destructive"
                  className="h-5 min-w-5 p-0 flex items-center justify-center text-[10px] font-bold"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[380px] max-w-[calc(100vw-2rem)] p-0"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <DropdownMenuLabel className="p-0 font-semibold text-base">
            Notifications
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto py-1 px-2 text-xs gap-1"
              onClick={(e) => {
                e.preventDefault();
                markAllAsRead();
              }}
            >
              <CheckCheck className="h-3 w-3" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Content */}
        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="h-8 w-8 text-destructive mb-2" />
              <p className="text-sm text-muted-foreground">
                Failed to load notifications
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => refetch()}
              >
                Try again
              </Button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium">All caught up!</p>
              <p className="text-xs text-muted-foreground mt-1">
                No new notifications
              </p>
            </div>
          ) : (
            <div className="py-1">
              {notifications.slice(0, 20).map((notification, index) => {
                const Icon = NOTIFICATION_ICONS[notification.type] || Bell;
                const colorClass =
                  NOTIFICATION_COLORS[notification.type] ||
                  NOTIFICATION_COLORS.GENERAL;

                return (
                  <DropdownMenuItem
                    key={notification.id}
                    className={`flex items-start gap-3 p-3 cursor-pointer focus:bg-accent ${
                      !notification.isRead
                        ? "bg-primary/5 border-l-2 border-l-primary"
                        : ""
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${colorClass} shadow-sm shrink-0`}
                    >
                      <Icon className="h-4 w-4 text-white" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium leading-tight line-clamp-1">
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground/70">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator className="m-0" />
            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full text-sm h-9"
                onClick={() => {
                  setIsOpen(false);
                  const isAdmin = apiEndpoint.includes("admin");
                  window.location.href = isAdmin
                    ? "/admin/notifications"
                    : "/staff/notifications";
                }}
              >
                View all notifications
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
