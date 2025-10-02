import { Suspense } from "react";
import { SchedulingPageContent } from "./_components/SchedulingPageContent";
import { SchedulingSkeleton } from "./_components/SchedulingSkeleton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scheduling",
  description: "Manage staff schedules, participant appointments, and service delivery tracking.",
};

export default function SchedulingPage() {
  return (
    <Suspense fallback={<SchedulingSkeleton />}>
      <SchedulingPageContent />
    </Suspense>
  );
}
