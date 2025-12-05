import { Suspense } from "react";
import { Metadata } from "next";
import { ScheduleContent } from "./_components/ScheduleContent";
import { ScheduleSkeleton } from "./_components/ScheduleSkeleton";

export const metadata: Metadata = {
  title: "My Schedule | EverKind Staff",
  description: "View your work schedule and shifts",
};

export default function SchedulePage() {
  return (
    <Suspense fallback={<ScheduleSkeleton />}>
      <ScheduleContent />
    </Suspense>
  );
}
