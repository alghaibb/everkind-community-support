import { Suspense } from "react";
import { Metadata } from "next";
import { StaffDashboardContent } from "./_components/StaffDashboardContent";
import { StaffDashboardSkeleton } from "./_components/StaffDashboardSkeleton";

export const metadata: Metadata = {
  title: "Staff Dashboard | EverKind",
  description: "Staff portal dashboard for EverKind Community Support",
};

export default function StaffDashboardPage() {
  return (
    <Suspense fallback={<StaffDashboardSkeleton />}>
      <StaffDashboardContent />
    </Suspense>
  );
}
