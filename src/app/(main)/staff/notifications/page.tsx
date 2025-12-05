import { Suspense } from "react";
import { Metadata } from "next";
import { NotificationsContent } from "./_components/NotificationsContent";
import { NotificationsSkeleton } from "./_components/NotificationsSkeleton";

export const metadata: Metadata = {
  title: "Notifications | EverKind Staff",
  description: "View your notifications",
};

export default function NotificationsPage() {
  return (
    <Suspense fallback={<NotificationsSkeleton />}>
      <NotificationsContent />
    </Suspense>
  );
}
