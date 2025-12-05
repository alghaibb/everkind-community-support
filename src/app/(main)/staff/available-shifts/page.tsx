import { Suspense } from "react";
import { Metadata } from "next";
import { AvailableShiftsContent } from "./_components/AvailableShiftsContent";
import { AvailableShiftsSkeleton } from "./_components/AvailableShiftsSkeleton";

export const metadata: Metadata = {
  title: "Available Shifts | EverKind Staff",
  description: "Browse and request available shifts",
};

export default function AvailableShiftsPage() {
  return (
    <Suspense fallback={<AvailableShiftsSkeleton />}>
      <AvailableShiftsContent />
    </Suspense>
  );
}
